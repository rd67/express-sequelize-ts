import { ISenderReceiverType } from "./common";

export enum IChatSupportStatus {
  open = "Open",
  closed = "Closed",
}

export interface ChatAttributes {
  id: number;

  userId: number;
  userType: ISenderReceiverType;

  oUserId: number;
  oUserType: ISenderReceiverType;

  supportStatus: IChatSupportStatus | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
