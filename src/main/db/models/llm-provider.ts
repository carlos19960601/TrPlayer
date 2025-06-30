import mainWindow from "@main/window";
import { AfterCreate, AfterUpdate, Column, DataType, Default, IsUUID, Model, Table } from "sequelize-typescript";


@Table({
  modelName: "LlmProvider",
  tableName: "llm_providers",
  underscored: true,
})
export class LlmProvider extends Model<LlmProvider> {
  @IsUUID("all")
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column(DataType.STRING)
  providerId: string // "openai", "mistral", etc.

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  baseUrl: string

  @Column(DataType.STRING)
  apiKey: string

  @AfterCreate
  static notifyForCreate(llmProvider: LlmProvider) {
    this.notify(llmProvider, "create")
  }

  @AfterUpdate
  static notifyForUpdate(llmProvider: LlmProvider) {
    this.notify(llmProvider, "update")
  }

  static notify(llmProvider: LlmProvider, action: "create" | "update") {
    if (!mainWindow.win) return;

    mainWindow.win.webContents.send("db-on-transaction", {
      model: "LlmProvider",
      id: llmProvider.id,
      action: action,
      record: llmProvider.toJSON(),
    })
  }
}