import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { IUserType, UserAttributes } from "@interfaces/users";

import { LanguageInstance } from "./languages";

import { AddressInstance } from "./addresses";

import { MediaInstance } from "./medias";

import { NotificationInstance } from "./notifications";

import { ChatInstance } from "./chats";
import { ChatMessageInstance } from "./chatMessages";

import { UserLangInstance } from "./userLangs";
import { UserDeviceInstance } from "./userDevices";
import { UserReferalInstance } from "./userReferals";

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "email"
    | "languageId"
    | "profilePic"
    | "coverPic"
    | "dob"
    | "description"
    | "isBlocked"
    | "userType"
    | "lastSeen"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}
export class UserInstance
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userType!: IUserType;

  public name!: string;

  public email!: string;
  // public preferredName!: string | null; // for nullable fields

  public phoneCode!: string;
  public phone!: string;

  public languageId!: number;

  public pin!: string;

  public profilePic!: string;
  public coverPic!: string;

  public dob!: Date | null;

  public description!: string | null;

  public isBlocked!: boolean;

  public lastSeen!: Date;

  public referalCode!: string;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public language?: LanguageInstance;

  public home?: AddressInstance;
  public locality?: AddressInstance;

  public notifications?: NotificationInstance[];

  public portfolio?: MediaInstance[];

  public userLangs?: UserLangInstance[];
  public userDevices?: UserDeviceInstance[];
  public userReferals?: UserReferalInstance[];

  public userChats?: ChatInstance[];
  public oUserChats?: ChatInstance[];
  public chatMessages?: ChatMessageInstance[];
}

const User = database.sequelize.define<UserInstance>(
  "users",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    userType: {
      type: DataTypes.TINYINT,
      defaultValue: IUserType.user,
    },

    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
    },
    email: {
      type: new DataTypes.STRING(50),
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

    languageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "languages", key: "id" },
      defaultValue: 1,

      onUpdate: "SET DEFAULT",
      onDelete: "SET DEFAULT",
      // One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or NO ACTION
    },

    pin: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: true,
    },

    profilePic: {
      type: new DataTypes.STRING(100),
      defaultValue: "",
    },
    coverPic: {
      type: new DataTypes.STRING(100),
      defaultValue: "",
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

    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastSeen: {
      type: database.Sequelize.DATE,
      allowNull: false,
      defaultValue: database.Sequelize.fn("NOW"),
    },

    referalCode: {
      type: new DataTypes.STRING(15),
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
    deletedAt: {
      type: database.Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },

    // createdAt: {
    //   type: database.Sequelize.DATE(3),
    //   allowNull: false,
    //   defaultValue: literal("CURRENT_TIMESTAMP(3)"),
    // },
    // updatedAt: {
    //   type: DataTypes.DATE(3),
    //   defaultValue: literal(
    //     "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"
    //   ),
    // },
    // deletedAt: {
    //   type: database.Sequelize.DATE(3),
    //   allowNull: true,
    //   defaultValue: null,
    // },

    // updatedAt: {
    //   type: 'DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'
    // }
  },
  {
    timestamps: true,
    paranoid: true,

    tableName: "users",

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
        fields: ["referalCode"],
      },
    ],
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
//@ts-ignore
User.associate = function (models) {
  const {
    Language,
    User,

    Notification,

    Media,

    Address,

    UserCode,
    UserLang,
    UserDevice,
    UserReferal,

    Chat,
    ChatMessage,
  } = models;

  // One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or NO ACTION

  User.belongsTo(Language, { foreignKey: "languageId", as: "language" });

  User.hasMany(Notification, {
    as: "receiverNotifications",
    foreignKey: "receiverId",
  });
  User.hasMany(Notification, {
    as: "senderNotifications",
    foreignKey: "senderId",
  });

  User.hasMany(Media, { as: "portfolio", foreignKey: "userId" });

  User.hasMany(UserCode, { as: "userCodes", foreignKey: "userId" });

  User.hasMany(UserLang, { foreignKey: "userId" });

  User.hasMany(UserDevice, { foreignKey: "userId" });

  User.hasMany(UserReferal, {
    as: "userReferals",
    foreignKey: "userId",
  });

  User.hasOne(Address, { as: "home", foreignKey: "userId" });
  User.hasOne(Address, { as: "locality", foreignKey: "userId" });

  //  Chats
  User.hasMany(Chat, {
    as: "userChats",
    foreignKey: "userId",
  });
  User.hasMany(Chat, {
    as: "oUserChats",
    foreignKey: "oUserId",
  });
  User.hasMany(ChatMessage, {
    as: "chatMessages",
    foreignKey: "userId",
  });
};

export default User;
