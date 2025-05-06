import { Column, DataType, Default, IsUUID, Model, Table, Unique } from "sequelize-typescript";

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


}