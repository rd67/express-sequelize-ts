import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { LanguagesAttributes } from "@interfaces/languages";

import { NotificationAttributes } from "@interfaces/notifications";

// Some attributes are optional in `User.build` and `User.create` calls
interface LanguageCreationAttributes
  extends Optional<LanguagesAttributes, "id" | "createdAt" | "updatedAt"> {}
export class LanguageInstance
  extends Model<LanguagesAttributes, LanguageCreationAttributes>
  implements LanguagesAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public name!: string;

  public code!: string;

  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public notifications?: NotificationAttributes[];
}

const Language = database.sequelize.define<LanguageInstance>(
  "languages",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: new DataTypes.STRING(20),
      allowNull: false,
    },
    code: {
      type: new DataTypes.STRING(2),
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

    tableName: "languages",

    indexes: [],
  }
);

//@ts-ignore
Language.associate = function (models) {
  const { User, Notification } = models;

  Language.hasMany(User, {
    as: "users",
    foreignKey: "languageId",
  });

  Language.hasMany(Notification, {
    as: "notifications",
    foreignKey: "languageId",
  });
};

export default Language;
