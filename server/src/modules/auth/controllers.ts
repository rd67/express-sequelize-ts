import { Request, Response } from "express";

import { MESSAGES } from "@constants/constants";

import { AsyncHandler } from "@middlewares/common";

import { successResponse, createResponse } from "@helpers/response";
import { getAuthToken } from "@helpers/jsonWebToken";

import * as services from "./services";
import * as constants from "./constants";

export const unique = AsyncHandler(async (req: Request, res: Response) => {
  const status = await services.userUniqueCheck({
    ...req.body,
  });

  return successResponse(req, res, {
    status,
  });
});

//  Signup Steps
export const signup = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.signup({
    ...req.body,
  });

  return successResponse(req, res, result);
});
export const signupOTP = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.signupOTP({
    ...req.body,
  });

  return createResponse(req, res, result);
});

//  Login Steps
export const login = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.login({
    ...req.body,
  });

  return successResponse(req, res, result);
});
export const loginOTP = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.loginOTP({
    ...req.body,
  });

  return successResponse(req, res, result);
});

//  Phone Change Steps
export const phoneChange = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.phoneChange({
    ...req.body,
  });

  return successResponse(req, res, result);
});
export const phoneChangeNew = AsyncHandler(
  async (req: Request, res: Response) => {
    const result = await services.phoneChangeNew({
      ...req.body,
    });

    return successResponse(req, res, result);
  }
);
export const phoneChangeOTP = AsyncHandler(
  async (req: Request, res: Response) => {
    await services.phoneChangeOTP({
      ...req.body,
    });

    return successResponse(req, res, {}, MESSAGES.phoneChangeSuccess);
  }
);

//  Pin Reset Steps
export const pinReset = AsyncHandler(async (req: Request, res: Response) => {
  const result = await services.pinReset({
    ...req.body,
  });

  return successResponse(req, res, result);
});
export const pinResetOTP = AsyncHandler(async (req: Request, res: Response) => {
  await services.pinResetOTP({
    ...req.body,
  });

  return successResponse(req, res, {}, constants.MESSAGES.pinResetSuccess);
});

export const logout = AsyncHandler(async (req: Request, res: Response) => {
  const jwt = getAuthToken(req);

  const log = await services.logout(jwt);

  return successResponse(
    req,
    res,
    {
      jwt,
      log,
    },
    constants.MESSAGES.loggedOut
  );
});

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminLogin = AsyncHandler(async (req: Request, res: Response) => {
  const authRes = await services.adminLogin({ ...req.body });

  return successResponse(req, res, authRes, constants.MESSAGES.login);
});

export const adminPasswordForgot = AsyncHandler(
  async (req: Request, res: Response) => {
    await services.adminPasswordForgot({
      ...req.body,
    });

    successResponse(req, res, {}, constants.MESSAGES.passwordForgot);
  }
);

export const adminPasswordReset = AsyncHandler(
  async (req: Request, res: Response) => {
    await services.adminPasswordReset({
      ...req.body,
    });

    successResponse(req, res, {}, constants.MESSAGES.passwordReset);
  }
);
