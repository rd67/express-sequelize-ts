import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { ISenderReceiverType } from "@interfaces/common";
import { IChatSupportStatus, ChatAttributes } from "@interfaces/chats";

import { UserInstance } from "./users";

import { ChatMessageInstance } from "./chatMessages";

import { NotificationInstance } from "./notifications";

// Some attributes are optional in the model
interface ChatCreationAttributes
  extends Optional<
    ChatAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > {}
export class ChatInstance
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public userId!: number;
  public userType!: ISenderReceiverType;

  public oUserId!: number;
  public oUserType!: ISenderReceiverType;

  public supportStatus!: IChatSupportStatus | null;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public user?: UserInstance;
  public oUser?: UserInstance;

  public chatMessages?: ChatMessageInstance[];

  public notifications?: NotificationInstance[];
}

const Chat = database.sequelize.define<ChatInstance>(
  "chats",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    //  userId will be 1, userType be Admin for Support Chat
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userType: {
      type: new DataTypes.ENUM(...Object.values(ISenderReceiverType)),
      allowNull: false,
    },

    oUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    oUserType: {
      type: new DataTypes.ENUM(...Object.values(ISenderReceiverType)),
      allowNull: false,
    },

    supportStatus: {
      type: new DataTypes.ENUM(...Object.values(IChatSupportStatus)),
      allowNull: true,
      defaultValue: null,
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
  },
  {
    timestamps: true,
    paranoid: true,

    tableName: "chats",

    indexes: [
      {
        unique: false,
        fields: ["updatedAt"],
      },
      {
        unique: false,
        fields: ["userId", "userType", "deletedAt"],
      },
      {
        unique: false,
        fields: ["oUserId", "oUserType", "deletedAt"],
      },
      {
        unique: false,
        name: "chat",
        fields: ["userId", "userType", "oUserId", "oUserType", "deletedAt"],
      },
    ],
  }
);

//@ts-ignore
Chat.associate = function (models) {
  const { User, ChatMessage, Notification } = models;

  //  User
  Chat.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });
  Chat.belongsTo(User, {
    as: "oUser",
    foreignKey: "oUserId",
  });

  Chat.hasMany(ChatMessage, {
    as: "chatMessages",
    foreignKey: "chatId",
  });

  Chat.hasMany(Notification, {
    as: "notifications",
    foreignKey: "chatId",
  });
};

export default Chat;
