import { Request, Response } from "express";

import { AsyncHandler } from "@middlewares/common";

import { successResponse } from "@helpers/response";

import * as services from "./services";

export const getAppVersioning = AsyncHandler(
  async (req: Request, res: Response) => {
    let result = await services.appVersioning();

    return successResponse(req, res, result);
  }
);
