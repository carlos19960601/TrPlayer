import { AudioFormats } from "@/constants";
import log from "@/main/logger";
import fs from "fs-extra";
import { t } from "i18next";
import path from "node:path";
import { Column, DataType, Default, IsUUID, Model, Table, Unique } from "sequelize-typescript";

const logger = log.scope("db/models/audio");

@Table({
  modelName: "Audio",
  tableName: "audios",
  underscored: true,
})
export class Audio extends Model {
  @IsUUID("all")
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Unique
  @Column(DataType.STRING)
  md5: string;

  // 记录来源
  // 如果是通过url下载，就记录url
  // 如果是通过文件上传，记录为空
  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  coverUrl: string;

  @Column(DataType.STRING)
  filePath: string;

  @Column(DataType.JSON)
  metadata: any;

  @Column(DataType.VIRTUAL)
  get mediaType(): string {
    return "Audio"
  }

  static async buildFromLocalFile(filePath: string): Promise<Audio> {
    try {
      fs.accessSync(filePath, fs.constants.R_OK)
    } catch (error) {
      logger.error("access file error: ", error)
      throw new Error(t("models.audio.fileNotFound", { file: filePath }))
    }

    const extname = path.extname(filePath).toLowerCase()
    if (!AudioFormats.includes(extname.split(".").pop() as string)) {
      throw new Error(t("models.audio.fileNotSupported", { file: filePath }))
    }

    return
  }
}