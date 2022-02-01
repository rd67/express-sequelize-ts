import { ISenderReceiverType } from "@interfaces/common";
import { IChatMessageKind } from "@interfaces/chatMessages";

//////////////////////////
//  //  //  Chat
//////////////////////////

export interface ChatAddParams {
  userType: ISenderReceiverType;

  oUserId: number;
  oUserType: ISenderReceiverType;

  kind: IChatMessageKind;

  message?: string;
  media?: string;
}

export interface ChatsHomeListParams {
  type: ISenderReceiverType.user;

  status: {
    open: boolean;
    assigned: boolean;
    clientCanceled: boolean;
    solved: boolean;
    reviewed: boolean;
  };

  limit: number;
  offset: number;
}

export interface ChatMessagesListParams {
  chatId: number;

  chatMessageId?: number;

  limit: number;
  offset: number;
}

//////////////////////////
//  //  //  Support
//////////////////////////

export interface SupportAddParams {
  chatId?: number;

  kind: IChatMessageKind;

  message?: string;
  media?: string;
}

export interface SupportHomeListParams {
  status: {
    open: boolean;
    closed: boolean;
  };

  limit: number;
  offset: number;
}
export interface SupportMessagesListParams {
  supportId: number;

  limit: number;
  offset: number;
}

export interface SupportChatUpdateParams {
  supportId: number;
}

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export interface AdminSupportHomeListParams {
  status: {
    open: boolean;
    closed: boolean;
  };

  limit: number;
  offset: number;
}

export interface AdminSupportChatListParams {
  supportId: number;

  limit: number;
  offset: number;
}

export interface AdminSupportAddParams {
  supportId: number;

  kind: IChatMessageKind;

  message?: string;
  media?: string;
}
