import { Model, DataTypes, Optional } from "sequelize";

import { IDeviceTypes } from "@interfaces/common";

import database from "@utils/mysql";

import { UserDevicesAttributes } from "@interfaces/userDevices";

import { UserInstance } from "./users";

// Some attributes are optional in the model
interface UserLangCreationAttributes
  extends Optional<
    UserDevicesAttributes,
    "id" | "deviceId" | "fcmId" | "createdAt" | "updatedAt"
  > {}
export class UserDeviceInstance
  extends Model<UserDevicesAttributes, UserLangCreationAttributes>
  implements UserDevicesAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public deviceType!: IDeviceTypes;

  public deviceId!: string | null;
  public fcmId!: string | null;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
}

const UserDevice = database.sequelize.define<UserDeviceInstance>(
  "userDevices",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    deviceType: {
      type: new DataTypes.ENUM(...Object.values(IDeviceTypes)),
      allowNull: false,
    },

    deviceId: {
      type: new DataTypes.STRING(500),
      allowNull: true,
    },
    fcmId: {
      type: new DataTypes.STRING(500),
      allowNull: false,
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

    tableName: "userDevices",

    indexes: [
      {
        unique: false,
        fields: ["userId"],
      },
    ],
  }
);

//@ts-ignore
UserDevice.associate = function (models) {
  const { User } = models;

  UserDevice.belongsTo(User, {
    foreignKey: "userId",
  });
};

export default UserDevice;
