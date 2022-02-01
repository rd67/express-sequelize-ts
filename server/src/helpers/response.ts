import { Request, Response } from "express";

import config from "@config/config";
import { STATUS_CODES, MESSAGES } from "@constants/constants";

import {
  ActionFailedError,
  NotFoundError,
  ValidationError,
  AuthFailedError,
} from "@helpers/errors";

import { logger } from "@utils/logger";
import { logInfo } from "./common";

const errorLine = (error: any) => {
  let initiator = "unknown place";
  if (typeof error.stack === "string") {
    let isFirst = true;
    for (const line of error.stack.split("\n")) {
      const matches = line.match(/^\s+at\s+(.*)/);
      if (matches) {
        if (!isFirst) {
          // first line - current function
          // second line - caller (what we are looking for)
          initiator = matches[1];
          break;
        }
        isFirst = false;
      }
    }
  }

  return initiator;
};

export const successResponse = (
  req: Request,
  res: Response,
  data: any = {},
  message = MESSAGES.success,
  statusCode = STATUS_CODES.SUCCESS
) => {
  const result = {
    statusCode,
    message: res.__(message), //Added Localization to response
    data,
  };

  //@ts-ignore
  const { originalUrl, method, ip, reqId } = req;

  logInfo({
    reqId,
    req: {
      originalUrl,
      method,
      ip,
      statusCode,
    },
    // result,
  });

  return res.status(statusCode).json(result);
};

export const errorResponse = (error: any, req: Request, res: Response) => {
  const statusCode =
    error.statusCode ?? error.response?.status ?? STATUS_CODES.ERROR;

  const logError = error.logError ?? true;

  //@ts-ignore
  const reqId = req["reqId"];

  if (statusCode === STATUS_CODES.ERROR) {
    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    Error.captureStackTrace(error, error.constructor);
  }

  if (logError) {
    let initiator = errorLine(error);

    logger.error(
      `statusCode=>${statusCode}, originalUrl=>${req.originalUrl}, method=>${req.method}, ip=>${req.ip}, reqId=>${reqId}, initiator=>${initiator}, Stack=>${error.stack}`
    );
  }

  if (config.app.isProduction && statusCode === STATUS_CODES.ERROR) {
    //TODO: ******  Production Error need to add notifications
    return res.status(statusCode).json({
      statusCode,
      message: res.__(MESSAGES.serverError),
      data: {},
    });
  }

  const message =
    error instanceof NotFoundError ||
    error instanceof ActionFailedError ||
    error instanceof ValidationError ||
    error instanceof AuthFailedError
      ? res.__(error.message)
      : error.toString();

  return res.status(statusCode).json({
    statusCode,
    message,
    data: error.data,
  });
};

export const createResponse = (
  req: Request,
  res: Response,
  data: any = {},
  message = MESSAGES.success,
  statusCode = STATUS_CODES.CREATED
) => {
  const result = {
    statusCode,
    message: res.__(message), //Added Localization to response
    data,
  };

  //@ts-ignore
  const { originalUrl, method, ip, reqId } = req;

  logInfo({
    reqId,
    req: {
      originalUrl,
      method,
      ip,
      statusCode,
    },
    // result,
  });

  return res.status(statusCode).json(result);
};
