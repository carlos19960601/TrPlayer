import { UserSettingKeyEnum } from "@/types/enums";
import { userSettingsHandler, videosHandler } from "@main/db/handlers";
import { Audio, UserSetting, Video } from "@main/db/models";
import { i18n } from "@main/i18n";
import log from "@main/logger";
import settings from "@main/settings";
import { ipcMain } from "electron";
import { Sequelize } from "sequelize-typescript";

const __dirname = import.meta.dirname;
const logger = log.scope("DB");

const handlers = [
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
          UserSetting,
          Video,
        ],
      });

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