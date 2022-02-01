import Joi from "joi";

import { ListingSchemaKeys } from "@constants/validation";

import { ISenderReceiverType } from "@interfaces/common";
import { IChatMessageKind } from "@interfaces/chatMessages";

//////////////////////////
//  //  //  Chat
//////////////////////////

export const chatAdd = {
  body: Joi.object().keys({
    userType: Joi.string().valid(ISenderReceiverType.user).required(),

    oUserId: Joi.number().required(),
    oUserType: Joi.string().valid(ISenderReceiverType.user).required(),

    kind: Joi.string()
      .valid(...Object.values(IChatMessageKind))
      .required(),

    message: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    media: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.forbidden(),
      otherwise: Joi.string().required(),
    }),
  }),
};

export const chatsHomeList = {
  query: Joi.object().keys({
    type: Joi.string().valid(ISenderReceiverType.user).required(),

    status: Joi.when(Joi.ref("type"), {
      is: ISenderReceiverType.user,
      then: Joi.object().keys({
        open: Joi.boolean().default(false).required(),
        assigned: Joi.boolean().default(false).required(),
        clientCanceled: Joi.boolean().default(false).required(),
        solved: Joi.boolean().default(false).required(),
        reviewed: Joi.boolean().default(false).required(),
      }),
      otherwise: Joi.object().keys({
        open: Joi.boolean().default(false).required(),
        offered: Joi.boolean().default(false).required(),
        assigned: Joi.boolean().default(false).required(),
        canceled: Joi.boolean().default(false).required(),
        paymentRequested: Joi.boolean().default(false).required(),
        solved: Joi.boolean().default(false).required(),
        reviewed: Joi.boolean().default(false).required(),
      }),
    }),

    limit: ListingSchemaKeys.limit,
    offset: ListingSchemaKeys.offset,
  }),
};

export const chatMessagesList = {
  params: Joi.object().keys({
    chatId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    limit: ListingSchemaKeys.limit,
    offset: ListingSchemaKeys.offset,
  }),
};

//////////////////////////
//  //  //  Support
//////////////////////////

export const supportAdd = {
  body: Joi.object().keys({
    supportId: Joi.number().optional(),

    kind: Joi.string()
      .valid(...Object.values(IChatMessageKind))
      .required(),

    message: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    media: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.forbidden(),
      otherwise: Joi.string().required(),
    }),
  }),
};

export const supportHomeList = {
  query: Joi.object().keys({
    status: Joi.object().keys({
      open: Joi.boolean().default(false).required(),
      closed: Joi.boolean().default(false).required(),
    }),

    limit: ListingSchemaKeys.limit,
    offset: ListingSchemaKeys.offset,
  }),
};

export const supportMessagesList = {
  params: Joi.object().keys({
    supportId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    limit: ListingSchemaKeys.limit,
    offset: ListingSchemaKeys.offset,
  }),
};

export const supportChatUpdate = {
  params: Joi.object().keys({
    supportId: Joi.number().required(),
  }),
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminSupportHomeList = {
  query: Joi.object().keys({
    ...ListingSchemaKeys,
  }),
};

export const adminSupportChatList = {
  params: Joi.object().keys({
    supportId: Joi.number().required(),
  }),
  query: Joi.object().keys({
    limit: ListingSchemaKeys.limit,
    offset: ListingSchemaKeys.offset,
  }),
};

export const adminSupportAdd = {
  params: Joi.object().keys({
    supportId: Joi.number().required(),
  }),
  body: Joi.object().keys({
    kind: Joi.string()
      .valid(...Object.values(IChatMessageKind))
      .required(),

    message: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    media: Joi.when(Joi.ref("kind"), {
      is: IChatMessageKind.message,
      then: Joi.forbidden(),
      otherwise: Joi.string().required(),
    }),
  }),
};
