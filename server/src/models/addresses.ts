import { Model, DataTypes, Optional } from "sequelize";

import { IPointType } from "@interfaces/common";

import database from "@utils/mysql";

import { IAddressKind, AddressAttributes } from "@interfaces/addresses";

import { UserInstance } from "./users";

// Some attributes are optional in the model
interface AddressCreationAttributes
  extends Optional<
    AddressAttributes,
    | "id"
    | "line2"
    | "city"
    | "state"
    | "zipCode"
    | "country"
    | "createdAt"
    | "updatedAt"
  > {}
export class AddressInstance
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;

  public kind!: IAddressKind;

  public formatted!: string;

  public line1!: string;

  public line2!: string | null;

  public city!: string | null;

  public state!: string | null;

  public zipCode!: string | null;

  public country!: string | null;

  public point!: IPointType;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
}

const Address = database.sequelize.define<AddressInstance>(
  "addresses",
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

    kind: {
      type: new DataTypes.ENUM(...Object.values(IAddressKind)),
      allowNull: false,
    },

    formatted: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: false,
    },

    line1: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },

    line2: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },

    city: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },

    state: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },

    zipCode: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },

    country: {
      type: new DataTypes.STRING(80),
      allowNull: true,
    },

    point: {
      type: DataTypes.GEOMETRY("POINT", 4326),
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

    tableName: "addresses",

    indexes: [
      {
        type: "SPATIAL",
        fields: ["point"],
      },
      {
        unique: false,
        fields: ["userId", "kind"],
      },
    ],
  }
);

//@ts-ignore
Address.associate = function (models) {
  const { User } = models;

  Address.belongsTo(User, {
    foreignKey: "userId",
  });
};

export default Address;
