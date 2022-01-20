import { Request, Response } from "express";

import { AsyncHandler } from "@middlewares/common";

import { successResponse } from "@helpers/response";

import * as interfaces from "./interfaces";
import * as services from "./services";

export const unique = AsyncHandler(async (req: Request, res: Response) => {
  const data: interfaces.UniqueData = {
    ...req.body,
  };

  let result = await services.unique(data);

  return successResponse(req, res, result);
});
