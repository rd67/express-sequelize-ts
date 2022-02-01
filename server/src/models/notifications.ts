import { Model, DataTypes, Optional } from "sequelize";

import database from "@utils/mysql";

import { ISenderReceiverType } from "@interfaces/common";
import {
  INotificationType,
  NotificationAttributes,
} from "@interfaces/notifications";

import { LanguageInstance } from "./languages";
import { UserInstance } from "./users";

import { ChatInstance } from "./chats";
import { ChatMessageInstance } from "./chatMessages";

// Some attributes are optional in `User.build` and `User.create` calls
interface NotificationCreationAttributes
  extends Optional<
    NotificationAttributes,
    | "id"
    | "chatId"
    | "chatMessageId"
    | "isRead"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}
export class NotificationInstance
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.

  public languageId!: number;

  public receiverId!: number;
  public receiverType!: ISenderReceiverType;

  public senderId!: number;
  public senderType!: ISenderReceiverType;

  public chatId!: number | null;
  public chatMessageId!: number | null;

  public message!: string;

  public type!: INotificationType;

  public isRead!: boolean;

  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;

  // You can also pre-declare possible inclusions, these will only be populated if you actively include a relation.
  // Note this is optional since it's only populated when explicitly requested in code
  public language?: LanguageInstance;

  public receiver?: UserInstance;

  public sender?: UserInstance;

  public chat?: ChatInstance;
  public chatMessage?: ChatMessageInstance;
}

const Notification = database.sequelize.define<NotificationInstance>(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    languageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "languages", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      // onUpdate: "SET NULL",
      // onDelete: "SET NULL",
    },

    receiverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      // onUpdate: "SET NULL",
      // onDelete: "SET NULL",
    },
    receiverType: {
      type: new DataTypes.ENUM(...Object.values(ISenderReceiverType)),
      allowNull: false,
    },

    senderId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      // onUpdate: "SET NULL",
      // onDelete: "SET NULL",
    },
    senderType: {
      type: new DataTypes.ENUM(...Object.values(ISenderReceiverType)),
      allowNull: false,
    },

    chatId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "chats", key: "id" },
      defaultValue: null,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    chatMessageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: "chatMessages", key: "id" },
      defaultValue: null,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    message: {
      type: new DataTypes.TEXT("tiny"),
      allowNull: true,
      defaultValue: null,
    },

    type: {
      type: new DataTypes.ENUM(...Object.values(INotificationType)),
      allowNull: false,
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

    tableName: "notifications",

    indexes: [
      {
        unique: false,
        fields: ["receiverId", "receiverType", "deletedAt"],
      },
      {
        unique: false,
        fields: ["senderId", "senderType", "deletedAt"],
      },
    ],
  }
);

//@ts-ignore
Notification.associate = function (models) {
  const { Language, User, Chat, ChatMessage } = models;
  Notification.belongsTo(Language, {
    as: "language",
    foreignKey: "languageId",
  });

  //  User
  Notification.belongsTo(User, {
    as: "receiver",
    foreignKey: "receiverId",
  });
  Notification.belongsTo(User, {
    as: "sender",
    foreignKey: "senderId",
  });

  //  Chat
  Notification.belongsTo(Chat, {
    as: "chat",
    foreignKey: "chatId",
  });
  Notification.belongsTo(ChatMessage, {
    as: "chatMessage",
    foreignKey: "chatMessageId",
  });
};

export default Notification;
