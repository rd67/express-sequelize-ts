import { Request, Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { AsyncHandler } from "@middlewares/common";

import { successResponse } from "@helpers/response";

import { userProfile } from "@modules/user/services";

import * as services from "./services";

export const languagesList = AsyncHandler(
  async (req: Request, res: Response) => {
    let languages = await services.languagesList();

    return successResponse(req, res, {
      languages,
    });
  }
);

export const languagesAdd = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    await services.languagesAdd(req.user.id, {
      ...req.body,
    });

    const user = await userProfile({ id: req.user.id });

    return successResponse(req, res, {
      user,
    });
  }
);
