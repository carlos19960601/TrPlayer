import { UserSettingKeyEnum } from "@/types/enums";
import log from "@main/logger";
import * as i18n from "i18next";
import {
  AllowNull,
  Column,
  DataType,
  Default,
  IsUUID,
  Model,
  Table,
} from "sequelize-typescript";

const logger = log.scope("db/userSetting");

@Table({
  modelName: "UserSetting",
  tableName: "user_settings",
  underscored: true,
  timestamps: true,
})
export class UserSetting extends Model<UserSetting> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id: string;

  @Column(DataType.STRING)
  key: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  value: string;

  static async clear(): Promise<void> {
    await UserSetting.destroy({ where: {} });
  }

  static async get(key: UserSettingKeyEnum): Promise<any> {
    const setting = await UserSetting.findOne({ where: { key } });
    if (!setting) return null;

    try {
      return JSON.parse(setting.value);
    } catch {
      return setting.value;
    }
  }

  static async set(key: UserSettingKeyEnum, value: any): Promise<void> {
    const setting = await UserSetting.findOne({ where: { key } });


    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    if (setting) {
      await setting.update({ value });
    } else {
      await UserSetting.create({ key, value });
    }

    // update i18n
    if (key === UserSettingKeyEnum.LANGUAGE) {
      try {
        await i18n.changeLanguage(value);
      } catch (error) {
        logger.error("UserSetting.set: changeLanguage failed", error);
      }
    }
  }
}
