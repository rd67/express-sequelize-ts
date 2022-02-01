import { ISenderReceiverType } from "./common";

export enum INotificationType {
  chatAdd = "ChatAdd",

  supportAdd = "SupportAdd",
  supportReply = "SupportReply",
}

export interface NotificationAttributes {
  id: number;

  languageId: number;

  receiverId: number;
  receiverType: ISenderReceiverType;

  senderId: number;
  senderType: ISenderReceiverType;

  chatId: number | null;
  chatMessageId: number | null;

  message: string;

  type: INotificationType;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
