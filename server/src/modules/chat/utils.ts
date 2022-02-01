import { signedURL } from "@utils/upload/s3";

import { ChatInstance } from "@models/chats";
import { ChatMessageInstance } from "@models/chatMessages";

import { formatUsers } from "@modules/user/utils";

export const formatChats = async (rows: ChatInstance[]) => {
  const formatted: ChatInstance[] = [];

  rows = JSON.parse(JSON.stringify(rows));

  for (let row of rows) {
    if (row.user) {
      row.user = (await formatUsers([row.user]))[0];
    }

    if (row.oUser) {
      row.oUser = (await formatUsers([row.oUser]))[0];
    }

    if (row.chatMessages) {
      row.chatMessages = await formatChatMessages(row.chatMessages);
    }

    formatted.push(row);
  }

  return formatted;
};

export const formatChatMessages = async (rows: ChatMessageInstance[]) => {
  const formatted: ChatMessageInstance[] = [];

  rows = JSON.parse(JSON.stringify(rows));

  for (let row of rows) {
    if (row.media) {
      row.mediaURL = await signedURL(row.media);
    }

    if (row.user) {
      row.user = (await formatUsers([row.user]))[0];
    }

    formatted.push(row);
  }

  return formatted;
};
