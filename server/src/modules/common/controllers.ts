import { Request, Response } from "express";

import { ExpressUserReq } from "@interfaces/common";

import { AsyncHandler } from "@middlewares/common";

import { createResponse, successResponse } from "@helpers/response";
import { ValidationError } from "@helpers/errors";

import { decodeJWT } from "@utils/jsonWebToken";

import { languagesList } from "@modules/language/services";

import * as services from "./services";
import * as constants from "./constants";

export const settings = AsyncHandler(async (req: Request, res: Response) => {
  const [settings, languages] = await Promise.all([
    services.settings(),
    languagesList(),
  ]);

  return successResponse(req, res, {
    settings,
    languages,
  });
});

export const decodeJWTToken = AsyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    let jwtData: any;

    let tokenError = constants.MESSAGES.tokenExpired;

    try {
      jwtData = await decodeJWT(token, { ignoreExpiration: true });

      //  Validation of JWT Expiry
      if (Date.now() >= jwtData.exp * 1000) {
        throw new ValidationError({ jwtData, tokenError }, tokenError);
      }
    } catch (error) {
      throw new ValidationError({ jwtData, tokenError }, tokenError);
    }

    return successResponse(req, res, {
      jwtData,
    });
  }
);

export const testNotification = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.testNotification(req.user.id, {
      reqId: req.reqId,
      ...req.body,
    });

    return successResponse(req, res, {
      data: result,
    });
  }
);

export const preSignedURLs = AsyncHandler(
  async (req: ExpressUserReq, res: Response) => {
    const result = await services.preSignedURLs({
      ...req.body,
    });

    return createResponse(req, res, {
      data: result,
    });
  }
);
