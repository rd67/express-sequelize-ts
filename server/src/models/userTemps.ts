import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { UserTempAttributes } from "@interfaces/userTemps";

// Some attributes are optional in `User.build` and `User.create` calls
interface UserTempCreationAttributes
  extends Optional<UserTempAttributes, "id" | "createdAt" | "updatedAt"> {}
export class UserTempInstance
  extends Model<UserTempAttributes, UserTempCreationAttributes>
  implements UserTempAttributes
{
  public id!: number;

  public name!: string;

  public phoneCode!: string;
  public phone!: string;

  public pin!: string;

  public createdAt!: Date;
  public updatedAt!: Date;
}

const UserTemp = database.sequelize.define<UserTempInstance>(
  "userTemps",
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

    phoneCode: {
      type: new DataTypes.STRING(5),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(15),
      allowNull: false,
    },

    pin: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: true,
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
      //@ts-ignore
      // onUpdate: literal("CURRENT_TIMESTAMP"),
    },

    // updatedAt: {
    //   // type: DataTypes.DATE(3),
    //   // // defaultValue: literal(
    //   // //   "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"
    //   // // ),
    //   // field: "updatedAt",

    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: literal("CURRENT_TIMESTAMP"),
    //   //@ts-ignore
    //   onUpdate: literal("CURRENT_TIMESTAMP"),
    // },
  },
  {
    timestamps: true,

    tableName: "userTemps",

    indexes: [
      {
        unique: true,
        fields: ["phone"],
      },
    ],
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
//@ts-ignore
UserTemp.associate = function (models) {
  const { UserTemp, UserCode } = models;

  UserTemp.hasMany(UserCode, { as: "userCodes", foreignKey: "userTempId" });
};

export default UserTemp;
