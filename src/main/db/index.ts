import { UserSettingKeyEnum } from "@/types/enums";
import { transcriptionsHandler, userSettingsHandler, videosHandler } from "@main/db/handlers";
import { Audio, Transcription, UserSetting, Video } from "@main/db/models";
import { i18n } from "@main/i18n";
import log from "@main/logger";
import settings from "@main/settings";
import { ipcMain } from "electron";
import fs from "fs-extra";
import path from "node:path";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";

const __dirname = import.meta.dirname;
const logger = log.scope("DB");

const handlers = [
  transcriptionsHandler,
  userSettingsHandler,
  videosHandler,
]

class DBWrapper {
  private isConnecting: boolean;
  public connection: Sequelize | null;

  constructor() {
    this.isConnecting = false;
    this.connection = null;
  }

  async connect() {
    if (this.isConnecting) {
      throw new Error("Database connection is already in progress");
    }
    this.isConnecting = true;

    const dbPath = settings.dbPath();
    if (!dbPath) {
      throw new Error("Db path is not ready");
    }

    try {
      if (this.connection) {
        return;
      }

      const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: dbPath,
        models: [
          Audio,
          Transcription,
          UserSetting,
          Video,
        ],
      });

      const umzug = new Umzug({
        migrations: {
          glob: ["migrations/*.js", { cwd: __dirname }],
        },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: logger
      })
      const pendingMigrations = await umzug.pending();
      logger.info(pendingMigrations);
      if (pendingMigrations.length > 0) {
        try {
          await this.backup({ force: true })
        } catch (err) {
          logger.error(err);
        }

        try {
          // migrate up to the latest state
          await umzug.up();
        } catch (err) {
          logger.error(err)
          throw err
        }
      } else {
        await this.backup()
      }

      await sequelize.sync();
      await sequelize.authenticate();

      // initialize i18n
      const language = (await UserSetting.get(UserSettingKeyEnum.LANGUAGE)) as string
      i18n(language)

      // register handlers
      logger.info(`Registering handlers`);
      for (const handler of handlers) {
        handler.register();
      }

      this.connection = sequelize;
      logger.info("Database connection established");
    } catch (err) {
      logger.error(err);
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }


  async backup(options?: { force: boolean }) {
    const force = options?.force ?? false

    const dbPath = settings.dbPath()
    if (!dbPath) {
      logger.error("Db path is not ready");
      return
    }

    const backupPath = path.join(settings.libraryPath(), "backup")
    fs.ensureDirSync(backupPath)

    const backupFiles = fs.readdirSync(backupPath).filter((file) => file.startsWith(path.basename(dbPath))).sort()

    // Check if the last backup is older than 1 day
    const lastBackup = backupFiles.pop()
    const timestamp = lastBackup?.match(/\d{13}/)?.[0]

    if (!force && lastBackup && timestamp && new Date(parseInt(timestamp)) > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
      logger.info(`Backup is up to date: ${lastBackup}`);
      return;
    }

    // Only keep the latest 10 backups
    if (backupFiles.length >= 10) {
      fs.removeSync(path.join(backupPath, backupFiles[0]))
    }

    const backupFilePath = path.join(backupPath, `${path.basename(dbPath)}.${Date.now().toString().padStart(13, "0")}`)
    fs.copySync(dbPath, backupFilePath)
    logger.info(`Backup created at ${backupFilePath}`);
  }

  registerIpcHandlers() {
    ipcMain.handle("db-connect", async () => {
      if (this.isConnecting) {
        return {
          state: "connecting",
          path: settings.dbPath(),
          error: null,
        }
      }

      try {
        await this.connect();
        return {
          state: "connected",
          path: settings.dbPath(),
          error: null,
        }
      } catch (err) {
        return {
          state: "error",
          path: settings.dbPath(),
          error: err.message,
        }
      }
    })
  }
}


export default new DBWrapper()