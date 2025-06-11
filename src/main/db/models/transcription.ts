import { Audio, Video } from "@main/db/models";
import log from "@main/logger";
import mainWindow from "@main/window";
import path from "node:path";
import { AfterCreate, AfterDestroy, AfterUpdate, BelongsTo, Column, DataType, Default, IsUUID, Model, Table, Unique } from "sequelize-typescript";

const logger = log.scope("db/models/transcription");

@Table({
  modelName: "Transcription",
  tableName: "transcriptions",
  underscored: true,
})
export class Transcription extends Model<Transcription> {
  @IsUUID("all")
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column(DataType.UUID)
  targetId: string;

  @Column(DataType.STRING)
  targetType: string;

  @Unique
  @Column(DataType.STRING)
  targetMd5: string;

  @Column(DataType.STRING)
  language: string;

  @Default("pending")
  @Column(DataType.ENUM("pending", "processing", "finished"))
  state: "pending" | "processing" | "finished";

  @Column(DataType.STRING)
  model: string;

  @Column(DataType.JSON)
  recognitionResult: RecognitionResult

  @BelongsTo(() => Video, { foreignKey: "targetId", constraints: true })
  video: Video;

  @BelongsTo(() => Audio, { foreignKey: "targetId", constraints: true })
  audio: Audio;

  @Column(DataType.VIRTUAL)
  get filename(): string {
    if (this.video) return path.basename(this.video.filePath)
    if (this.audio) return path.basename(this.audio.filePath)

    return null
  }
  @Column(DataType.VIRTUAL)
  get coverUrl(): string {
    if (this.video) return `local://${this.video.coverUrl}`
    if (this.audio) return `local://${this.audio.coverUrl}`

    return null
  }

  @AfterCreate
  static notifyForCreate(transcription: Transcription) {
    this.notify(transcription, "create")
  }

  @AfterUpdate
  static notifyForUpdate(transcription: Transcription) {
    logger.info("notifyForUpdate", transcription.id)
    this.notify(transcription, "update");
  }

  @AfterDestroy
  static notifyForDestroy(transcription: Transcription) {
    this.notify(transcription, "destroy");
  }

  static notify(transcription: Transcription, action: "create" | "update" | "destroy") {
    if (!mainWindow.win) return

    mainWindow.win.webContents.send("db-on-transaction", {
      model: "Transcription",
      id: transcription.id,
      action: action,
      record: transcription.toJSON(),
    })
  }
}