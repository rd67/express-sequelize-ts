import { Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { AsyncHandler } from "@middlewares/common";

import { createResponse, successResponse } from "@helpers/response";

import * as services from "./services";
import * as utils from "./utils";

export const mediaAdd = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const media = await services.mediaAdd(req.user.id, {
      ...req.body,
    });

    const formatted = await utils.formatMedias([media]);

    return createResponse(req, res, {
      media: formatted[0],
    });
  }
);

export const mediasList = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    //@ts-ignore
    const medias = await services.mediasList(req.user.id, {
      ...req.query,
    });

    const list = await utils.formatMedias(medias);

    return successResponse(req, res, {
      list,
    });
  }
);

export const mediaDelete = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    //@ts-ignore
    await services.mediaDelete(req.user.id, {
      ...req.query,
    });

    return successResponse(req, res, {});
  }
);
