import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { UserAttributes } from "@interfaces/users";

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;

  public email!: string;
  // public preferredName!: string | null; // for nullable fields

  public countryCode!: string;
  public phone!: string;

  public passport!: string;

  public pin!: string;

  public profilePic!: string | null;
  public coverPic!: string | null;

  public dob!: Date | null;

  public description!: string;
  public tagline!: string | null;

  public isUserBlocked!: boolean;
  public isSolverBlocked!: boolean;

  public lastSeen!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  // public countProjects!: HasManyCountAssociationsMixin;
}

const User = database.sequelize.define<UserModel>(
  "users",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    email: {
      type: new DataTypes.STRING(100),
      allowNull: false,
      //Index
    },

    countryCode: {
      type: new DataTypes.STRING(5),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(15),
      allowNull: false,
      //Index
    },

    passport: {
      type: new DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "",
      //Index
    },

    pin: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: false,
      defaultValue: "",
    },

    profilePic: {
      type: new DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
    },
    coverPic: {
      type: new DataTypes.STRING(150),
      allowNull: true,
      defaultValue: null,
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    description: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: true,
      defaultValue: null,
    },
    tagline: {
      type: new DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
    },

    isUserBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSolverBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // paranoid: true,

    indexes: [
      {
        unique: false,
        fields: ["email"],
      },
      {
        unique: false,
        fields: ["phone"],
      },
      {
        unique: false,
        fields: ["passport"],
      },
    ],
  }
);

export default User;
