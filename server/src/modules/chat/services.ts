import { WhereOptions, Op } from "sequelize";

import { ISenderReceiverType } from "@interfaces/common";
import { IChatSupportStatus, ChatAttributes } from "@interfaces/chats";
import { ChatMessagesAttributes } from "@interfaces/chatMessages";
import { INotificationType } from "@interfaces/notifications";

import { NotFoundError, ActionFailedError } from "@helpers/errors";

import {
  NotificationQueue,
  INotificationQueueKinds,
  INewChatNotificationQueueJobData,
} from "@queues/notificationQueue";

import models from "@models/index";
import { ChatInstance } from "@models/chats";

import { notificationGenerate } from "@modules/notification/services";

import { DEFAULT_LANGUAGE } from "@modules/language/constants";

import * as interfaces from "./interfaces";
import * as constants from "./constants";

//////////////////////////
//  //  //  Chat
//////////////////////////

export const chatAdd = async (
  userData: {
    userId: number;
    name: string;
  },
  data: interfaces.ChatAddParams
) => {
  const [chat, chatCreated] = await models.Chat.findOrCreate({
    where: {
      userId: userData.userId,
      userType: data.userType,
      oUserId: data.oUserId,
      oUserType: data.oUserType,
    },
  });

  const chatMessage = await models.ChatMessage.create({
    chatId: chat.id,

    userId: userData.userId,

    message: data.message || null,

    media: data.media || null,

    kind: data.kind,
  });

  await Promise.all([
    models.Chat.update(
      {
        updatedAt: chatMessage.updatedAt,
      },
      {
        where: { id: chat.id },
      }
    ),
    notificationGenerate({
      languageId: 1, //TODO:Static

      sender: {
        id: userData.userId,
        userType: data.userType,
        name: userData.name,
      },

      receiver: {
        id: data.oUserId,
        userType: data.oUserType,
        name: "",
      },

      chatId: chat.id,
      chatMessageId: chatMessage.id,

      type: INotificationType.chatAdd,
    }),
  ]);

  // Added to Queue to send Email, Socket
  const queueData: INewChatNotificationQueueJobData = {
    kind: INotificationQueueKinds.newChat,
    chatMessageId: chatMessage.id,
  };
  NotificationQueue.add(queueData);

  return {
    chatId: chat.id,
    chatMessageId: chatMessage.id,
  };
};

export const chatsHomeList = async (
  userId: number,
  data: interfaces.ChatsHomeListParams
) => {
  // const orQuery = [];

  //  If no Or Query then adding always false query in or: { userId: 0 }
  const query: WhereOptions<ChatAttributes> = {
    [Op.and]: [
      {
        supportStatus: null,
      },
      {
        [Op.or]: [
          {
            userId,
            userType: ISenderReceiverType.user,
          },
          {
            oUserId: userId,
            oUserType: ISenderReceiverType.user,
          },
        ],
      },
      // {
      //   [Op.or]: orQuery.length ? orQuery : { userId: 0 },
      // },
    ],
  };

  const result = await models.Chat.findAndCountAll({
    where: query,
    attributes: ["id", "userId", "userType", "oUserId", "oUserType"],
    include: [
      {
        model: models.User,
        as: "user",
        attributes: ["id", "name", "profilePic"],
      },
      {
        model: models.User,
        as: "oUser",
        attributes: ["id", "name", "profilePic"],
      },
      {
        // Latest Message
        model: models.ChatMessage,
        as: "chatMessages",
        attributes: [
          "id",
          "userId",
          "message",
          "media",
          "kind",
          "isRead",
          "createdAt",
        ],
        order: [["id", "DESC"]],
        limit: 1,
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: data.limit,
    offset: data.offset,
  });

  return {
    ...result,
    query,
  };
};

export const chatMessagesList = async (
  userId: number,
  data: interfaces.ChatMessagesListParams
) => {
  const query: WhereOptions<ChatMessagesAttributes> = {
    chatId: data.chatId,
  };

  if (data.chatMessageId) {
    query["id"] = data.chatMessageId;
  }

  const [chatMessages] = await Promise.all([
    models.ChatMessage.findAll({
      where: query,
      attributes: ["id", "userId", "message", "media", "kind", "createdAt"],
      order: [["id", "DESC"]],
      limit: data.limit,
      offset: data.offset,
    }),
    models.ChatMessage.update(
      {
        isRead: true,
      },
      {
        where: {
          chatId: data.chatId,
          isRead: false,
          userId: {
            [Op.ne]: userId,
          },
        },
      }
    ),
  ]);

  return chatMessages;
};

//////////////////////////
//  //  //  Support
//////////////////////////

export const supportAdd = async (
  userData: {
    userId: number;
    name: string;
  },
  data: interfaces.SupportAddParams
) => {
  let support: ChatInstance;

  if (data.chatId) {
    support = (await models.Chat.findOne({
      where: {
        id: data.chatId,
        userId: userData.userId,
        supportStatus: {
          [Op.ne]: null,
        },
      },
    })) as ChatInstance;
    if (!support) {
      throw new NotFoundError(constants.MESSAGES.supportNotFound);
    }
  } else {
    support = await models.Chat.create({
      userId: userData.userId,
      userType: ISenderReceiverType.user,
      oUserId: 1,
      oUserType: ISenderReceiverType.admin,
      supportStatus: IChatSupportStatus.open,
    });
  }

  if (support.supportStatus !== IChatSupportStatus.open) {
    throw new ActionFailedError(constants.MESSAGES.supportNotOpen);
  }

  const chatMessage = await models.ChatMessage.create({
    chatId: support.id,
    userId: userData.userId,
    message: data.message || null,
    media: data.media || null,
    kind: data.kind,
  });

  await Promise.all([
    models.Chat.update(
      {
        updatedAt: chatMessage.updatedAt,
      },
      {
        where: { id: support.id },
      }
    ),
    notificationGenerate({
      languageId: DEFAULT_LANGUAGE.id,
      sender: {
        id: userData.userId,
        userType: support.userType,
        name: userData.name,
      },
      receiver: {
        id: 1,
        userType: ISenderReceiverType.admin,
        name: "",
      },

      chatId: support.id,
      chatMessageId: chatMessage.id,
      type: INotificationType.supportAdd,
    }),
  ]);

  //TODO Notification
  return {
    support,
    chatMessage,
  };
};

export const supportHomeList = async (
  userId: number,
  data: interfaces.SupportHomeListParams
) => {
  const orQuery = [];
  if (data.status.open) {
    orQuery.push({
      supportStatus: IChatSupportStatus.open,
    });
  }
  if (data.status.closed) {
    orQuery.push({
      supportStatus: IChatSupportStatus.closed,
    });
  }

  const query: WhereOptions<ChatAttributes> = {
    [Op.and]: [
      {
        [Op.or]: orQuery.length
          ? orQuery
          : { supportStatus: { [Op.ne]: null } },
      },
      {
        userId: userId,
      },
    ],
  };

  const result = await models.Chat.findAndCountAll({
    where: query,
    attributes: ["id", "oUserId", "oUserType", "supportStatus"],
    include: [
      {
        // Latest Message
        model: models.ChatMessage,
        as: "chatMessages",
        attributes: [
          "id",
          "userId",
          "message",
          "media",
          "kind",
          "isRead",
          "createdAt",
        ],
        order: [["id", "DESC"]],
        limit: 1,
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: data.limit,
    offset: data.offset,
  });

  return result;
};

export const supportMessagesList = async (
  userId: number,
  data: interfaces.SupportMessagesListParams
) => {
  const query: WhereOptions<ChatMessagesAttributes> = {
    chatId: data.supportId,
  };

  const [chatMessages] = await Promise.all([
    models.ChatMessage.findAll({
      where: query,
      attributes: ["id", "userId", "message", "media", "kind", "createdAt"],
      order: [["id", "DESC"]],
      limit: data.limit,
      offset: data.offset,
    }),
    models.ChatMessage.update(
      {
        isRead: true,
      },
      {
        where: {
          chatId: data.supportId,
          isRead: false,
          userId: {
            [Op.ne]: userId,
          },
        },
      }
    ),
  ]);

  return chatMessages;
};

export const supportChatUpdate = async (
  userId: number,
  data: interfaces.SupportChatUpdateParams
) => {
  const support = await models.Chat.findOne({
    where: {
      id: data.supportId,
      userId,
      supportStatus: {
        [Op.ne]: null,
      },
    },
  });
  if (!support) {
    throw new NotFoundError(constants.MESSAGES.supportNotFound);
  } else if (support.supportStatus !== IChatSupportStatus.open) {
    throw new ActionFailedError(constants.MESSAGES.supportNotOpen);
  }

  await models.Chat.update(
    {
      supportStatus: IChatSupportStatus.closed,
    },
    {
      where: {
        id: support.id,
      },
    }
  );
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminSupportHomeList = async (
  data: interfaces.AdminSupportHomeListParams
) => {
  const query: WhereOptions<ChatAttributes> = {
    supportStatus: { [Op.ne]: null },
  };

  const result = await models.Chat.findAndCountAll({
    where: query,
    attributes: ["id", "userId", "userType", "supportStatus"],
    include: [
      {
        model: models.User,
        as: "user",
        attributes: ["id", "name", "profilePic"],
      },
      {
        // Latest Message
        model: models.ChatMessage,
        as: "chatMessages",
        attributes: [
          "id",
          "userId",
          "message",
          "media",
          "kind",
          "isRead",
          "createdAt",
        ],
        order: [["id", "DESC"]],
        limit: 1,
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: data.limit,
    offset: data.offset,
  });

  return result;
};

export const adminSupportChatList = async (
  userId: number,
  data: interfaces.AdminSupportChatListParams
) => {
  const query: WhereOptions<ChatMessagesAttributes> = {
    chatId: data.supportId,
  };

  const [chatMessages] = await Promise.all([
    models.ChatMessage.findAll({
      where: query,
      attributes: ["id", "userId", "message", "media", "kind", "createdAt"],
      include: [
        {
          model: models.User,
          as: "user",
          attributes: ["id", "name", "profilePic"],
        },
      ],
      order: [["id", "DESC"]],
      limit: data.limit,
      offset: data.offset,
    }),
    models.ChatMessage.update(
      {
        isRead: true,
      },
      {
        where: {
          chatId: data.supportId,
          isRead: false,
          userId: {
            [Op.ne]: userId,
          },
        },
      }
    ),
  ]);

  return chatMessages;
};

export const adminSupportAdd = async (
  userData: {
    userId: number;
  },
  data: interfaces.AdminSupportAddParams
) => {
  const support = await models.Chat.findOne({
    where: {
      id: data.supportId,
      supportStatus: {
        [Op.ne]: null,
      },
    },
  });
  if (!support) {
    throw new NotFoundError(constants.MESSAGES.supportNotFound);
  }

  const chatMessage = await models.ChatMessage.create({
    chatId: support.id,
    userId: userData.userId,
    message: data.message || null,
    media: data.media || null,
    kind: data.kind,
  });

  await Promise.all([
    models.Chat.update(
      {
        updatedAt: chatMessage.updatedAt,
      },
      {
        where: { id: support.id },
      }
    ),
    notificationGenerate({
      languageId: DEFAULT_LANGUAGE.id,
      sender: {
        id: userData.userId,
        userType: ISenderReceiverType.admin,
        name: "Support",
      },
      receiver: {
        id: support.userId,
        userType: ISenderReceiverType.user,
        name: "",
      },

      chatId: support.id,
      chatMessageId: chatMessage.id,
      type: INotificationType.supportReply,
    }),
  ]);

  //TODO Notification
  return {
    support,
    chatMessage,
  };
};
