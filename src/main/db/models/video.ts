import { VideoFormats } from "@/constants";
import log from "@/main/logger";
import { hashFile } from "@/main/utils";
import fs from "fs-extra";
import { t } from "i18next";
import path from "node:path";
import { Column, DataType, Default, IsUUID, Model, Table, Unique } from "sequelize-typescript";
import { v5 as uuidv5 } from "uuid";

const logger = log.scope("db/models/audio");

@Table({
  modelName: "Video",
  tableName: "videos",
  underscored: true,
})
export class Video extends Model<Video> {
  @IsUUID("all")
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Unique
  @Column(DataType.STRING)
  md5: string;

  @Column(DataType.STRING)
  name: string;

  // 记录来源
  // 如果是通过url下载，就记录url
  // 如果是通过文件上传，记录为空
  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  filePath: string;


  static async buildFromLocalFile(filePath: string, params?: { source?: string; }): Promise<Video> {
    try {
      fs.accessSync(filePath, fs.constants.R_OK)
    } catch (error) {
      logger.error("access file error: ", error)
      throw new Error(t("models.video.fileNotFound", { file: filePath }))
    }

    const extname = path.extname(filePath).toLowerCase()
    if (!VideoFormats.includes(extname.split(".").pop() as string)) {
      throw new Error(t("models.video.fileNotSupported", { file: filePath }))
    }

    const md5 = await hashFile(filePath, { algo: "md5" })

    const existing = await Video.findOne({ where: { md5 } })
    if (existing) {
      logger.warn("Video already exists:", existing.id, existing.filePath);
      existing.changed("updatedAt", true)
      existing.update({ updatedAt: new Date() })
      return existing
    }

    // Generate ID
    const id = uuidv5(`${filePath}/${md5}`, uuidv5.URL)
    logger.debug("Generated ID:", id)


    const name = path.basename(filePath, extname)
    const {
      source,
    } = params || {}

    const record = this.build({
      id,
      name,
      source,
      filePath,
      md5,
    })

    return record.save().catch((err) => {
      logger.error(err);
      throw err
    })
  }
}