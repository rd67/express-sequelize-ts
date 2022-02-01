import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { ICodeType, UserCodeAttributes } from "@interfaces/userCodes";

import { UserInstance } from "./users";
import { UserTempInstance } from "./userTemps";

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCodeCreationAttributes
  extends Optional<UserCodeAttributes, "id" | "createdAt" | "updatedAt"> {}
class UserCodeInstance
  extends Model<UserCodeAttributes, UserCodeCreationAttributes>
  implements UserCodeAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public userTempId!: number | null;

  public phoneCode!: string;
  public phone!: string;

  public email!: string;

  public code!: number;

  public codeType!: ICodeType;

  public expiresAt!: Date | string;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
  public userTemp?: UserTempInstance;
}

const UserCode = database.sequelize.define<UserCodeInstance>(
  "userCodes",
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
      defaultValue: 1,

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    userTempId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "userTemps", key: "id" },
      defaultValue: null,

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    phoneCode: {
      type: new DataTypes.STRING(5),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(15),
      allowNull: false,
    },

    email: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },

    code: {
      type: DataTypes.INTEGER,
    },

    codeType: {
      type: new DataTypes.ENUM(...Object.values(ICodeType)),
      allowNull: false,
    },

    expiresAt: {
      type: database.Sequelize.DATE(3),
      allowNull: false,
      // defaultValue: literal("CURRENT_TIMESTAMP(3)"),
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

    tableName: "userCodes",

    indexes: [
      {
        unique: false,
        fields: ["userId"],
      },
      {
        unique: false,
        fields: ["userTempId"],
      },
      {
        unique: false,
        fields: ["userId", "userTempId", "codeType"],
      },
    ],
  }
);

//@ts-ignore
UserCode.associate = function (models) {
  const { User, UserCode, UserTemp } = models;

  UserCode.belongsTo(User, { foreignKey: "userId", as: "user" });

  UserCode.belongsTo(UserTemp, { foreignKey: "userTempId", as: "userTemp" });
};

export default UserCode;
