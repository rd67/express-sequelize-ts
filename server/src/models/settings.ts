import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { SettingAttributes, IAppVersioning } from "@interfaces/settings";
import { DefaultAppVersioning } from "@constants/settings";

// Some attributes are optional in `Setting.build` and `Setting.create` calls
interface SettingCreationAttributes extends Optional<SettingAttributes, "id"> {}

class SettingModel
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes
{
  public id!: number;

  public versioning!: IAppVersioning;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const Setting = database.sequelize.define<SettingModel>(
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
  },
  {}
);

export default Setting;
