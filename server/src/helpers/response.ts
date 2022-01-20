import { Request, Response } from "express";

import config from "@config/config";
import { STATUS_CODES, MESSAGES } from "@constants/constants";

import { OperationalError } from "@helpers/errors";

import { logger } from "@utils/logger";

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

  logger.info(
    JSON.stringify(
      {
        reqId,
        req: {
          originalUrl,
          method,
          ip,
          statusCode,
        },
        // result,
      },
      null,
      2
    )
  );

  return res.status(statusCode).json(result);
};

export const errorResponse = (error: any, req: Request, res: Response) => {
  // logError(error);

  const statusCode =
    error.code ||
    error.statusCode ||
    error.response?.status ||
    STATUS_CODES.ERROR;

  //@ts-ignore
  const reqId = req["reqId"];

  logger.error(
    `${statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${reqId}`
  );

  if (config.app.isProduction && statusCode === STATUS_CODES.ERROR) {
    //TODO: ******  Production Error need to add notifications
    return res.status(statusCode).json({
      statusCode,
      message: res.__(MESSAGES.serverError),
      data: {},
    });
  }

  if (!(error instanceof OperationalError)) {
    return res.status(statusCode).json({
      statusCode,
      message: error.toString(),
      data: error.data,
    });
  }

  return res.status(statusCode).json({
    statusCode,
    message: res.__(error.message),
    data: error.data,
  });
};
