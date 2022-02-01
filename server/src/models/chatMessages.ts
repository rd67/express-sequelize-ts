import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import {
  IChatMessageKind,
  ChatMessagesAttributes,
} from "@interfaces/chatMessages";

import { UserInstance } from "./users";

import { NotificationInstance } from "./notifications";

// Some attributes are optional in the model
interface ChatMessagesCreationAttributes
  extends Optional<
    ChatMessagesAttributes,
    "id" | "isRead" | "createdAt" | "updatedAt" | "deletedAt"
  > {}
export class ChatMessageInstance
  extends Model<ChatMessagesAttributes, ChatMessagesCreationAttributes>
  implements ChatMessagesAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public chatId!: number;

  public userId!: number;

  public message!: string | null;

  public media!: string | null;

  public kind!: IChatMessageKind;

  public isRead!: boolean;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public mediaURL?: string;

  public user?: UserInstance;
  public solver?: UserInstance;

  public notification?: NotificationInstance;
}

const ChatMessage = database.sequelize.define<ChatMessageInstance>(
  "chatMessages",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    chatId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "chats", key: "id" },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },

      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    message: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: true,
      defaultValue: null,
    },

    media: {
      type: new DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },

    kind: {
      type: new DataTypes.ENUM(...Object.values(IChatMessageKind)),
      allowNull: false,
      defaultValue: IChatMessageKind.message,
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

    tableName: "chatMessages",

    indexes: [
      {
        unique: false,
        fields: ["chatId", "deletedAt"],
      },
      {
        unique: false,
        fields: ["userId", "deletedAt"],
      },
      {
        unique: false,
        fields: ["chatId", "userId", "deletedAt"],
      },
    ],
  }
);

//@ts-ignore
ChatMessage.associate = function (models) {
  const { Chat, User, Notification } = models;

  ChatMessage.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });

  ChatMessage.belongsTo(Chat, {
    as: "chat",
    foreignKey: "chatId",
  });

  ChatMessage.hasOne(Notification, {
    as: "notification",
    foreignKey: "chatId",
  });
};

export default ChatMessage;
