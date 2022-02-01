import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { UserLangAttributes } from "@interfaces/userLangs";

import { UserInstance } from "./users";
import { LanguageInstance } from "./languages";

// Some attributes are optional in `User.build` and `User.create` calls
interface UserLangCreationAttributes
  extends Optional<UserLangAttributes, "id" | "createdAt" | "updatedAt"> {}
export class UserLangInstance
  extends Model<UserLangAttributes, UserLangCreationAttributes>
  implements UserLangAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public languageId!: number;

  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
  public languages?: LanguageInstance[];
}

const UserLang = database.sequelize.define<UserLangInstance>(
  "userLangs",
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

    languageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "languages", key: "id" },
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

    tableName: "userLangs",

    indexes: [
      {
        unique: true,
        fields: ["userId", "languageId"],
      },
    ],
  }
);

//@ts-ignore
UserLang.associate = function (models) {
  const { User, Language } = models;

  UserLang.belongsTo(User, {
    foreignKey: "userId",
  });

  UserLang.belongsTo(Language, {
    foreignKey: "languageId",
  });
};

export default UserLang;
