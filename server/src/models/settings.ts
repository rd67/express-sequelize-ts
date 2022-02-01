import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { DefaultAppVersioning } from "@constants/settings";

import { SettingAttributes, IAppVersioning } from "@interfaces/settings";

// Some attributes are optional in `Setting.build` and `Setting.create` calls
interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id" | "createdAt" | "updatedAt"> {}

class SettingInstance
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes
{
  public id!: number;

  public versioning!: IAppVersioning;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
}

const Setting = database.sequelize.define<SettingInstance>(
  "settings",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    versioning: {
      type: DataTypes.JSON,
      defaultValue: DefaultAppVersioning,
    },

    createdAt: {
      type: database.Sequelize.DATE,
      allowNull: false,
      defaultValue: database.Sequelize.fn("NOW"),
    },
    updatedAt: {
      type: database.Sequelize.DATE,
      allowNull: false,
      defaultValue: database.Sequelize.fn("NOW"),
    },
  },
  {
    timestamps: true,

    tableName: "settings",
  }
);

export default Setting;
