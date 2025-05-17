import { Video } from "@main/db/models";
import path from "node:path";
import { BelongsTo, Column, DataType, Default, IsUUID, Model, Table, Unique } from "sequelize-typescript";

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

  @BelongsTo(() => Video, { foreignKey: "targetId", constraints: false })
  video: Video;

  @Column(DataType.VIRTUAL)
  get filename(): string {
    return path.basename(this.video.filePath)
  }
}