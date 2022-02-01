import { Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { AsyncHandler } from "@middlewares/common";

import { successResponse } from "@helpers/response";

import * as services from "./services";
import * as utils from "./utils";

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminNotificationList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const { rows, count } = await services.adminNotificationList(req.user.id, {
      ...(req.query as any),
    });

    const list = await utils.formatNotifications(rows);

    return successResponse(req, res, {
      count,
      list,
    });
  }
);
