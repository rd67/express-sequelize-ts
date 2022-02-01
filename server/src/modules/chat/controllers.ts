import { Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { AsyncHandler } from "@middlewares/common";

import { createResponse, successResponse } from "@helpers/response";

import * as services from "./services";
import * as utils from "./utils";
import * as constants from "./constants";

//////////////////////////
//  //  //  Chat
//////////////////////////

export const chatAdd = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    //  Creating Chat Message Id
    const { chatId, chatMessageId } = await services.chatAdd(
      {
        userId: req.user.id,
        name: req.user.name,
      },
      { ...req.body }
    );

    //  Retriving Above Created Chat Message
    const chatMessages = await services.chatMessagesList(req.user.id, {
      chatId,
      chatMessageId,
      limit: 1,
      offset: 0,
    });

    const list = await utils.formatChatMessages(chatMessages);

    return createResponse(req, res, { list });
  }
);

export const chatsHomeList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const data = {
      ...(req.query as any),
    };

    const result = await services.chatsHomeList(req.user.id, data);

    const list = await utils.formatChats(result.rows);

    return successResponse(req, res, {
      count: result.count,
      list,
    });
  }
);

export const chatMessagesList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const chatMessages = await services.chatMessagesList(req.user.id, {
      ...(req.query as any),
      ...req.params,
    });

    const list = await utils.formatChatMessages(chatMessages);

    return successResponse(req, res, {
      list,
    });
  }
);

//////////////////////////
//  //  //  Support
//////////////////////////

export const supportAdd = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.supportAdd(
      {
        userId: req.user.id,
        name: req.user.name,
      },
      { ...req.body }
    );

    return createResponse(req, res, {});
  }
);

export const supportHomeList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.supportHomeList(req.user.id, {
      ...(req.query as any),
    });

    const list = await utils.formatChats(result.rows);

    return successResponse(req, res, {
      count: result.count,
      list,
    });
  }
);

export const supportMessagesList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const chatMessages = await services.supportMessagesList(req.user.id, {
      ...(req.query as any),
      ...req.params,
    });

    const list = await utils.formatChatMessages(chatMessages);

    return successResponse(req, res, {
      list,
    });
  }
);

export const supportChatUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.supportChatUpdate(req.user.id, {
      ...(req.params as any),
    });

    return successResponse(req, res, {}, constants.MESSAGES.supportClosed);
  }
);

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminSupportHomeList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const { rows, count } = await services.adminSupportHomeList({
      ...(req.query as any),
    });

    const list = await utils.formatChats(rows);

    return successResponse(req, res, {
      count,
      list,
    });
  }
);

export const adminSupportChatList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const chatMessages = await services.adminSupportChatList(1, {
      ...(req.query as any),
      ...req.params,
    });

    const list = await utils.formatChatMessages(chatMessages);

    return successResponse(req, res, {
      list,
    });
  }
);

export const adminSupportAdd = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.adminSupportAdd(
      {
        userId: req.user.id,
      },
      {
        ...req.params,
        ...req.body,
      }
    );

    return createResponse(req, res, {});
  }
);
