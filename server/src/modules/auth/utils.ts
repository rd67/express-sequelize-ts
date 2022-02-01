import { WhereOptions } from "sequelize/types";
import { SignOptions } from "jsonwebtoken";

import { UserDevicesAttributes } from "@interfaces/userDevices";

import { encodeJWT } from "@utils/jsonWebToken";
import { cacheDelete, cacheSetMember } from "@utils/redis";

import { cacheKeyDetailGenerate } from "@helpers/cache";

import models from "@models/index";

import { removeUserCache } from "@modules/user/utils";

import * as interfaces from "./interfaces";

//  Removing User Devices, Login Tokens from cache, user cache
export const userLogoutActions = async (userId: number) => {
  Promise.all([
    removeAuthUserCache(userId),
    removeUserDevices({ userId }),
    removeUserCache(userId),
  ]);
};

export const removeAuthUserCache = (userId: number | null) => {
  if (userId === null) {
    return;
  }

  //Removing all the logged in user tokens from cache.
  const authCacheKeyDetails = cacheKeyDetailGenerate.auth(userId);

  return cacheDelete(authCacheKeyDetails.key);
};

export const removeUserDevices = async (
  query: WhereOptions<UserDevicesAttributes>
) => {
  await models.UserDevice.destroy({
    where: query,
  });
};

export const generateAuthJWTTokenAndCache = async (
  data: Omit<interfaces.IUserAuthJWTData, "kind">
): Promise<{
  token: string;
  expiry: number;
}> => {
  //  Generating auth token and caching the auth token value to set
  const authCacheKeyDetails = cacheKeyDetailGenerate.auth(data.userId);

  const userJWTData: interfaces.IUserAuthJWTData = {
    kind: "auth",

    ...data,
  };

  let jwtOptions: SignOptions = {
    expiresIn: authCacheKeyDetails.ex,
  };

  const authToken = encodeJWT(userJWTData, jwtOptions);

  //  Add auth to to use auth cache set
  await cacheSetMember(authCacheKeyDetails.key, authToken);

  return {
    token: authToken,
    expiry: jwtOptions.expiresIn as number,
  };
};
