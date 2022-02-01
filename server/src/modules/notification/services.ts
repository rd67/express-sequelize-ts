import { WhereOptions } from "sequelize";

import { ISenderReceiverType } from "@interfaces/common";
import {
  INotificationType,
  NotificationAttributes,
} from "@interfaces/notifications";

import { localize } from "@utils/i18n";

import models from "@models/index";

import * as interfaces from "./interfaces";
import * as constants from "./constants";

export const notificationGenerate = async ({
  languageId = 1,

  receiver,

  sender,

  chatId = null,
  chatMessageId = null,

  type,
}: {
  languageId: number;

  receiver: {
    id: number;
    userType: ISenderReceiverType;

    name: string;
  };

  sender: {
    id: number;
    userType: ISenderReceiverType;

    name: string;
  };

  chatId?: number | null;
  chatMessageId?: number | null;

  type: INotificationType;
}) => {
  let message = "";
  switch (type) {
    case INotificationType.chatAdd: {
      message = localize.__(constants.MESSAGES.chatAdd, {
        senderName: sender.name,
      });
      break;
    }

    //  Support
    case INotificationType.supportAdd: {
      message = localize.__(constants.MESSAGES.supportAdd, {
        senderName: sender.name,
      });
      break;
    }
    case INotificationType.supportReply: {
      message = localize.__(constants.MESSAGES.supportReply, {
        senderName: sender.name,
      });
      break;
    }
  }

  const notification = await models.Notification.create({
    languageId,

    receiverId: receiver.id,
    receiverType: receiver.userType,

    senderId: sender.id,
    senderType: sender.userType,

    chatId,
    chatMessageId,

    message,

    type,
  });

  return notification;
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminNotificationList = async (
  userId: number,
  data: interfaces.AdminNotificationListParams
) => {
  const query: WhereOptions<NotificationAttributes> = {
    receiverType: ISenderReceiverType.admin,
  };

  const [result] = await Promise.all([
    models.Notification.findAndCountAll({
      where: query,
      attributes: ["id", "message", "type", "isRead", "createdAt"],
      include: [
        {
          model: models.User,
          as: "sender",
          attributes: ["id", "name", "profilePic"],
        },
      ],
      order: [["id", "DESC"]],
      limit: data.limit,
      offset: data.offset,
    }),
    models.Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          receiverType: ISenderReceiverType.admin,
          isRead: false,
        },
      }
    ),
  ]);

  return result;
};
