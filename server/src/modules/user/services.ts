import { WhereOptions, Op } from "sequelize";

import { MESSAGES } from "@constants/constants";

import { cacheGet, cacheSet } from "@utils/redis";
import { comparehash, hashString } from "@utils/bcrypt";

import { UserAttributes } from "@interfaces/users";
import { ICodeType } from "@interfaces/userCodes";
import { IMediaKind } from "@interfaces/medias";
import { IAddressKind } from "@interfaces/addresses";

import { cacheKeyDetailGenerate } from "@helpers/cache";
import { NotFoundError, ActionFailedError } from "@helpers/errors";
import { dayJS } from "@helpers/date";
import { seqCurrentDt } from "@helpers/sequelize";
import { convertToPoint } from "@helpers/common";

import models from "@models/index";
import { UserInstance } from "@models/users";

import { authUserResponse, userUniqueCheck } from "@modules/auth/services";
import { removeAuthUserCache } from "@modules/auth/utils";

import { userCodeGenerate } from "@modules/common/services";

import * as constants from "./constants";
import * as interfaces from "./interfaces";
import * as utils from "./utils";

export const getOneAndCache = async (userId: number) => {
  const cacheKeyName = cacheKeyDetailGenerate.user(userId);

  let userCache = await cacheGet(cacheKeyName);

  let user: UserInstance;

  if (!userCache) {
    user = await userGet({ id: userId });

    await cacheSet(cacheKeyName, JSON.stringify(user));
  } else {
    user = JSON.parse(userCache);
  }

  return user;
};

export const userGet = async (query: object) => {
  const user = await models.User.findOne({
    where: query,
  });
  if (!user) {
    throw new NotFoundError(constants.MESSAGES.notFound, false);
  }

  return (await utils.formatUsers([user]))[0];
};

export const userProfile = async (query: object) => {
  const user = await models.User.findOne({
    where: query,
    include: [
      {
        model: models.Language,
        as: "language",
        required: false,
        attributes: ["id", "name", "code"],
      },
      {
        model: models.UserLang,
        required: false,
        attributes: ["id", "languageId"],
        include: [
          {
            model: models.Language,
            required: true,
            attributes: ["id", "name", "code"],
          },
        ],
      },
      {
        model: models.Media,
        as: "portfolio",
        required: false,
        attributes: ["id", "media", "kind"],
        where: { kind: IMediaKind.portfolio },
      },
      {
        model: models.Address,
        as: "home",
        required: false,
        where: { kind: IAddressKind.home },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: models.Address,
        as: "locality",
        required: false,
        where: { kind: IAddressKind.locality },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
  if (!user) {
    throw new NotFoundError(constants.MESSAGES.notFound);
  }

  return (await utils.formatUsers([user]))[0];
};

//  Profile Update
export const profileUpdate = async (
  userId: number,
  data: interfaces.ProfileUpdateParams
) => {
  await models.User.update(
    {
      name: data.name,

      profilePic: data.profilePic,
      coverPic: data.coverPic,
      dob: data.dob ? new Date(data.dob) : null,
      description: data.description,

      lastSeen: seqCurrentDt(),
    },
    {
      where: {
        id: userId,
      },
    }
  );
};

//  Other User Profile
export const oUserProfile = async (data: interfaces.OUserProfileParams) => {
  const user = await models.User.findOne({
    where: {
      id: data.oUserId,
    },
    attributes: ["id", "name", "profilePic", "coverPic", "lastSeen"],
    include: [
      {
        model: models.Media,
        as: "portfolio",
        required: false,
        attributes: ["id", "media", "kind"],
        where: { kind: IMediaKind.portfolio },
      },
      {
        model: models.UserLang,
        required: false,
        attributes: ["id", "languageId"],
        include: [
          {
            model: models.Language,
            required: true,
            attributes: ["id", "name", "code"],
          },
        ],
      },
      {
        model: models.Address,
        as: "locality",
        required: false,
        where: { kind: IAddressKind.locality },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
  if (!user) {
    throw new NotFoundError(constants.MESSAGES.notFound);
  }

  return user;
};

//  Default Language Update
export const languageUpdate = async (userId: number, languageId: number) => {
  await models.User.update(
    {
      languageId,
      lastSeen: seqCurrentDt(),
    },
    {
      where: { id: userId },
    }
  );
};

//  Address Update
export const addressUpdate = async (
  userId: number,
  data: interfaces.AddressUpdateParams
) => {
  await models.Address.destroy({
    where: {
      userId,
      kind: data.kind,
    },
  });

  await models.Address.create({
    userId,
    kind: data.kind,
    formatted: data.address.formatted,
    line1: data.address.line1,
    line2: data.address.line2,
    city: data.address.city,
    state: data.address.state,
    zipCode: data.address.zipCode,
    country: data.address.country,
    point: convertToPoint(data.address.latitude, data.address.longitude),
  });
};

//  Phone Change Steps
export const phoneUpdate = async (
  userId: number,
  data: interfaces.PhoneUpdateParams
) => {
  const user = (await models.User.findOne({
    where: { id: userId },
    raw: true,
  })) as UserInstance;

  if (user.phone === data.phone) {
    throw new ActionFailedError(constants.MESSAGES.samePhoneProvided);
  }

  const comparePin = await comparehash(data.pin, user.pin);
  if (!comparePin) {
    throw new ActionFailedError(MESSAGES.incorrectPin);
  }

  //  New Phone Number Unique Ness Check
  await userUniqueCheck({
    type: "phone",
    value: data.phone,
  });

  const userCode = await userCodeGenerate({
    userId: user.id,
    phoneCode: data.phoneCode,
    phone: data.phone,
    email: user.email,
    codeType: ICodeType.phoneUpdate,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const phoneUpdateOTP = async (
  userId: number,
  data: interfaces.PhoneUpdateOTPParams
) => {
  const query = {
    id: data.userCodeId,
    userId,
    codeType: ICodeType.phoneUpdate,
    code: data.otp,
  };

  console.log({
    msg: "phoneUpdateOTP->query",
    query,
  });

  const userCode = await models.UserCode.findOne({
    where: query,
    // include: [{ model: User, as: "user", required: true }],
  });
  if (!userCode) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }
  const expIsAfter = dayJS(userCode.expiresAt).isBefore(new Date());
  if (expIsAfter) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  //  Phone Unique Check
  await userUniqueCheck({
    type: "phone",
    value: userCode.phone,
  });

  //  Updating the Phone Number and removing user code
  await Promise.all([
    models.User.update(
      {
        phoneCode: userCode.phoneCode,
        phone: userCode.phone,
        lastSeen: seqCurrentDt(),
      },
      {
        where: { id: userCode.userId },
      }
    ),
    models.UserCode.destroy({ where: { id: data.userCodeId } }),
    //  Removing Auth and User Cache
    removeAuthUserCache(userCode.userId),
    utils.removeUserCache(userCode.userId),
  ]);

  const authRes = await authUserResponse(userId);

  return authRes;
};

//  Email Change Steps
export const emailUpdate = async (
  userId: number,
  data: interfaces.EmailUpdateParams
) => {
  const user = (await models.User.findOne({
    where: { id: userId },
    raw: true,
  })) as UserInstance;

  if (user.email === data.email) {
    throw new ActionFailedError(constants.MESSAGES.sameEmailProvided);
  }

  const comparePin = await comparehash(data.pin, user.pin);
  if (!comparePin) {
    throw new ActionFailedError(MESSAGES.incorrectPin);
  }

  //  New Email Unique Ness Check
  await userUniqueCheck({
    type: "email",
    value: data.email,
  });

  const userCode = await userCodeGenerate({
    userId: user.id,
    phoneCode: user.phoneCode,
    phone: user.phone,
    email: data.email,
    codeType: ICodeType.emailUpdate,
    sendSMSOTP: false,
    sendSMSEmail: false,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const emailUpdateOTP = async (
  userId: number,
  data: interfaces.EmailUpdateOTPParams
) => {
  const query = {
    id: data.userCodeId,
    userId,
    codeType: ICodeType.emailUpdate,
    code: data.otp,
  };

  console.log({
    msg: "emailUpdateOTP->query",
    query,
  });

  const userCode = await models.UserCode.findOne({
    where: query,
  });
  if (!userCode) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }
  const expIsAfter = dayJS(userCode.expiresAt).isBefore(new Date());
  if (expIsAfter) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  //  Email Unique Check
  await userUniqueCheck({
    type: "email",
    value: userCode.email,
  });

  //  Updating the Email and removing user code
  await Promise.all([
    models.User.update(
      {
        email: userCode.email,
        lastSeen: seqCurrentDt(),
      },
      {
        where: { id: userCode.userId },
      }
    ),
    models.UserCode.destroy({ where: { id: data.userCodeId } }),
    //  Removing Auth and User Cache
    removeAuthUserCache(userCode.userId),
    utils.removeUserCache(userCode.userId),
  ]);

  const authRes = await authUserResponse(userId);

  return authRes;
};

//  Pin Update Steps
export const pinUpdate = async (
  {
    userId,
    phoneCode,
    phone,
    email,
  }: {
    userId: number;
    phoneCode: string;
    phone: string;
    email: string;
  },
  data: interfaces.PinUpdateParams
): Promise<{
  userCodeId: number;
}> => {
  const query = {
    phone: data.phone,
  };

  console.log({
    msg: "pinUpdate->query",
    query,
  });

  const userCode = await userCodeGenerate({
    userId,
    phoneCode,
    phone,
    email,
    codeType: ICodeType.pinReset,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const pinUpdateOTP = async (
  userId: number,
  data: interfaces.PinUpdateOTPParams
) => {
  const query = {
    id: data.userCodeId,
    userId,
    codeType: ICodeType.pinUpdate,
    code: data.otp,
  };

  console.log({
    msg: "pinUpdateOTP->query",
    query,
  });

  const userCode = await models.UserCode.findOne({
    where: query,
  });
  if (!userCode) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const expIsAfter = dayJS(userCode.expiresAt).isBefore(new Date());
  if (expIsAfter) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const pin = await hashString(data.pin);

  //  Updating the Pin and removing user code
  await Promise.all([
    models.User.update(
      { pin, lastSeen: seqCurrentDt() },
      {
        where: { id: userCode.userId },
      }
    ),
    models.UserCode.destroy({ where: { id: data.userCodeId } }),
    //  Removing Auth and User Cache
    removeAuthUserCache(userCode.userId),
    utils.removeUserCache(userCode.userId),
  ]);

  const authRes = await authUserResponse(userId);

  return authRes;
};

export const getOneUser = async (query: object) => {
  const user = await models.User.findOne({
    where: query,
    // raw: true,
  });
  //TODO&&  Will be based on which Account they are requesting
  if (!user) {
    throw new NotFoundError(constants.MESSAGES.notFound);
  }

  return JSON.parse(JSON.stringify(user));
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminUsersList = async (data: interfaces.AdminUsersListParams) => {
  let query: WhereOptions<UserAttributes> = {};

  if (data.startDt && data.endDt) {
    query.createdAt = {
      [Op.between]: [data.startDt, data.endDt],
    };
  }

  if (data.search) {
    query = {
      ...query,
      [Op.or]: [
        { name: { [Op.like]: `%${data.search}%` } },
        { email: { [Op.like]: `%${data.search}%` } },
        // Sequelize.where(
        //   Sequelize.fn("LOWER", Sequelize.col("name")),
        //   "LIKE",
        //   `%${data.search}%`
        // ),
      ],
    };
  }

  const result = await models.User.findAndCountAll({
    where: query,
    attributes: [
      "id",
      "userType",
      "name",
      "email",
      "phoneCode",
      "phone",
      "profilePic",
      "isBlocked",
      "lastSeen",
      "createdAt",
    ],
    raw: true,
    limit: data.limit,
    offset: data.offset,
  });

  return result;
};
