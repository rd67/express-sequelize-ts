import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

import { config } from "@config/index";
import { STATUS_CODES, MESSAGES } from "@constants/constants";

import { clientRedis } from "@utils/redis";

// Rate Limit Request
const rateLimiter = new RateLimiterRedis({
  storeClient: clientRedis,
  keyPrefix: "middleware",
  points: config.default.redis.rateLimit, // 10 requests
  duration: 1, // per 1 second by IP
});

export const ReqRateLimiterHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  try {
    await rateLimiter.consume(req.ip);
    return next();
  } catch (err) {
    console.error(err);

    ///TODO: make this error dynamic
    const errType = `Limit Request Error:`;
    const status = STATUS_CODES.TOO_MANY_REQUESTS;
    const message = req.__(MESSAGES.tooManyRequest);

    console.log(chalk.red(errType), chalk.green(message));

    return res.status(status).json({ code: status, message });
  }
};
