export enum IChatMessageKind {
  message = "Message",
  image = "Image",
  video = "Video",
}

export interface ChatMessagesAttributes {
  id: number;

  chatId: number;

  userId: number;

  message: string | null;

  media: string | null;

  kind: IChatMessageKind;

  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
