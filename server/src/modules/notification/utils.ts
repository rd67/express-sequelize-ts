import { NotificationInstance } from "@models/notifications";

import { formatUsers } from "@modules/user/utils";
import { formatChatMessages, formatChats } from "@modules/chat/utils";

export const formatNotifications = async (rows: NotificationInstance[]) => {
  const formatted: NotificationInstance[] = [];

  rows = JSON.parse(JSON.stringify(rows));

  for (let row of rows) {
    if (row.sender) {
      row.sender = (await formatUsers([row.sender]))[0];
    }

    if (row.chat) {
      row.chat = (await formatChats([row.chat]))[0];
    }
    if (row.chatMessage) {
      row.chatMessage = (await formatChatMessages([row.chatMessage]))[0];
    }

    formatted.push(row);
  }

  return formatted;
};
