import { Request, Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { MESSAGES } from "@constants/constants";

import { AsyncHandler } from "@middlewares/common";

import { successResponse } from "@helpers/response";

import * as services from "./services";
import * as utils from "./utils";
import * as constants from "./constants";
import * as interfaces from "./interfaces";

export const userProfile = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const user = await services.userProfile({
      id: req.user.id,
    });

    return successResponse(req, res, {
      user,
    });
  }
);

export const profileUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.profileUpdate(req.user.id, {
      ...req.body,
    });

    const user = await services.userProfile({
      id: req.user.id,
    });

    return successResponse(req, res, {
      user,
    });
  }
);

export const oUserProfile = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const user = await services.oUserProfile({
      ...(req.params as any),
    });

    const formatted = (await utils.formatUsers([user]))[0];

    return successResponse(req, res, {
      user: formatted,
    });
  }
);

export const languageUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.languageUpdate(req.user.id, Number(req.params.languageId));

    const user = await services.userProfile({
      id: req.user.id,
    });

    return successResponse(req, res, {
      user,
    });
  }
);

export const addressUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.addressUpdate(req.user.id, {
      ...req.body,
    });

    const user = await services.userProfile({
      id: req.user.id,
    });

    return successResponse(req, res, {
      user,
    });
  }
);

//  Phone Change Steps
export const phoneUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.phoneUpdate(req.user.id, {
      ...req.body,
    });

    return successResponse(req, res, result);
  }
);
export const phoneUpdateOTP = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.phoneUpdateOTP(req.user.id, {
      ...req.body,
    });

    return successResponse(req, res, result, MESSAGES.phoneChangeSuccess);
  }
);

//  Email Change Steps
export const emailUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.emailUpdate(req.user.id, {
      ...req.body,
    });

    return successResponse(req, res, result);
  }
);
export const emailUpdateOTP = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.emailUpdateOTP(req.user.id, {
      ...req.body,
    });

    return successResponse(
      req,
      res,
      result,
      constants.MESSAGES.emailChangeSuccess
    );
  }
);

//  Pin Change Steps
export const pinUpdate = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.pinUpdate(
      {
        userId: req.user.id,
        phoneCode: req.user.phoneCode,
        phone: req.user.phone,
        email: req.user.email,
      },
      {
        ...req.body,
      }
    );

    return successResponse(req, res, result);
  }
);
export const pinUpdateOTP = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.pinUpdateOTP(req.user.id, {
      ...req.body,
    });

    return successResponse(
      req,
      res,
      result,
      constants.MESSAGES.pinChangeSuccess
    );
  }
);

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminUsersList = AsyncHandler(
  async (req: Request, res: Response) => {
    //@ts-ignore
    const data: interfaces.AdminUsersListParams = {
      ...req.query,
    };

    const { rows, count } = await services.adminUsersList(data);

    const list = await utils.formatUsers(rows);

    return successResponse(req, res, {
      count,
      list,
    });
  }
);
