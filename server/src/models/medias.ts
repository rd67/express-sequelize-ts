import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { IMediaKind, MediaAttributes } from "@interfaces/medias";

import { UserInstance } from "./users";

// Some attributes are optional in the model
interface MediaCreationAttributes
  extends Optional<MediaAttributes, "id" | "createdAt" | "updatedAt"> {}
export class MediaInstance
  extends Model<MediaAttributes, MediaCreationAttributes>
  implements MediaAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public media!: string;

  public kind!: IMediaKind;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public mediaURL?: string;

  public user?: UserInstance;
}

const Media = database.sequelize.define<MediaInstance>(
  "medias",
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

    media: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },

    kind: {
      type: new DataTypes.ENUM(...Object.values(IMediaKind)),
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

    tableName: "medias",

    indexes: [
      {
        unique: false,
        fields: ["userId", "kind"],
      },
    ],
  }
);

//@ts-ignore
Media.associate = function (models) {
  const { User } = models;

  Media.belongsTo(User, {
    foreignKey: "userId",
  });
};

export default Media;
