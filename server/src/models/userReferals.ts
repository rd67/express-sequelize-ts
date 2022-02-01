import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { UserReferalAttributes } from "@interfaces/userReferals";

import { UserInstance } from "./users";

// Some attributes are optional in the model
interface UserReferalCreationAttributes
  extends Optional<UserReferalAttributes, "id" | "createdAt" | "updatedAt"> {}
export class UserReferalInstance
  extends Model<UserReferalAttributes, UserReferalCreationAttributes>
  implements UserReferalAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public oUserId!: number;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
  public oUser?: UserInstance;
}

const UserReferal = database.sequelize.define<UserReferalInstance>(
  "userReferals",
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

    oUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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

    tableName: "userReferals",

    indexes: [
      {
        unique: false,
        fields: ["userId", "oUserid"],
      },
    ],
  }
);

//@ts-ignore
UserReferal.associate = function (models) {
  const { User } = models;

  UserReferal.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });

  UserReferal.belongsTo(User, {
    as: "oUser",
    foreignKey: "oUserId",
  });
};

export default UserReferal;
