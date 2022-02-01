import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";

import { STATUS_CODES, MESSAGES } from "@constants/constants";
import { ExpressUserReq } from "@interfaces/common";

import { cacheKeyDetailGenerate } from "@helpers/cache";
import { AuthFailedError, NotFoundError } from "@helpers/errors";

import { decodeJWT, jwtPackage } from "@utils/jsonWebToken";
import { cacheCheckMember } from "@utils/redis";

import { IUserAuthJWTData } from "@modules/auth/interfaces";

import { getOneAndCache } from "@modules/user/services";

import { socketIdCacheAdd } from "@utils/socket/helpers";

import { AsyncHandler } from "./common";

export const getAuthJWT = (req: Request) => {
  const authHeader: string = req.get("authorization") || "";

  if (!authHeader) {
    return "";
  }

  const parts = authHeader.split(" ");

  if (parts[0] !== "Bearer") {
    return "";
  }

  return parts[1];
};

export const AuthHandler = ({
  jwtAuthRequired = true,

  userTypeRequired = 0,
}: {
  jwtAuthRequired?: boolean;

  userTypeRequired?: number;
}) => {
  return AsyncHandler(
    async (req: ExpressUserReq, res: Response, next: NextFunction) => {
      //  JWT Auth Check
      const jwt = getAuthJWT(req);

      if (jwtAuthRequired && !jwt) {
        throw new AuthFailedError(MESSAGES.missingAuthHeader);
      }

      try {
        const decoded = (await decodeJWT(jwt)) as IUserAuthJWTData;

        const userId = decoded.userId;

        const userAuthCacheKey = cacheKeyDetailGenerate.auth(userId);

        //  Check if token is valid
        const validateToken = await cacheCheckMember(userAuthCacheKey.key, jwt);
        if (!validateToken) {
          throw new AuthFailedError(MESSAGES.authTokenExpired);
        }

        const user = await getOneAndCache(userId);

        if (userTypeRequired && !(user.userType & userTypeRequired)) {
          throw new AuthFailedError(
            MESSAGES.missingPerm,
            STATUS_CODES.FORBIDDEN
          );
        }

        req.user = user;
        req.authToken = jwt;

        return next();
      } catch (err) {
        if (
          err instanceof jwtPackage.TokenExpiredError ||
          err instanceof NotFoundError
        ) {
          throw new AuthFailedError(MESSAGES.authTokenExpired);
        }

        if (err instanceof jwtPackage.JsonWebTokenError) {
          throw new AuthFailedError(
            MESSAGES.authTokenVerificationFailed,
            STATUS_CODES.FORBIDDEN
          );
        }

        throw err;
      }
    }
  );
};

export const SocketAuthHandler = async (socket: Socket, next: any) => {
  //  JWT Auth Check
  const token = socket.handshake.query?.token as string;

  if (!token) {
    throw new AuthFailedError(MESSAGES.missingAuthHeader);
  }

  try {
    const decoded = (await decodeJWT(token)) as IUserAuthJWTData;

    const userId = decoded.userId;

    const userAuthCacheKey = cacheKeyDetailGenerate.auth(userId);

    //  Check if token is valid
    const validateToken = await cacheCheckMember(userAuthCacheKey.key, token);
    if (!validateToken) {
      throw new AuthFailedError(MESSAGES.authTokenExpired);
    }

    const user = await getOneAndCache(userId);

    socket.data.user = user;

    //  Caching the Socket Id
    await socketIdCacheAdd(user.id, socket.id);

    return next();
  } catch (err) {
    if (
      err instanceof jwtPackage.TokenExpiredError ||
      err instanceof NotFoundError
    ) {
      throw new AuthFailedError(MESSAGES.authTokenExpired);
    }

    if (err instanceof jwtPackage.JsonWebTokenError) {
      throw new AuthFailedError(
        MESSAGES.authTokenVerificationFailed,
        STATUS_CODES.FORBIDDEN
      );
    }

    throw err;
  }
};
