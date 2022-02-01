import { Op } from "sequelize";

import { MESSAGES } from "@constants/constants";

import { ICodeType } from "@interfaces/userCodes";
import { IUserType } from "@interfaces/users";

import mysql from "@utils/mysql";
import { comparehash, hashString } from "@utils/bcrypt";
import { decodeJWT } from "@utils/jsonWebToken";
import { cacheDelete, cacheGet } from "@utils/redis";

import { generateReferalCode, logInfo } from "@helpers/common";
import { ActionFailedError } from "@helpers/errors";
import { dayJS } from "@helpers/date";
import { cacheKeyDetailGenerate } from "@helpers/cache";
import { seqCurrentDt } from "@helpers/sequelize";

import {
  UserQueue,
  IUserQueueKinds,
  IUserRegisterQueueJobData,
} from "@queues/userQueue";
import {
  EmailSendQueue,
  IEmailQueueKinds,
  IPasswordResetMailQueueJobData,
} from "@queues/emailQueue";

import models from "@models/index";
import { UserInstance } from "@models/users";
import { UserTempInstance } from "@models/userTemps";

import { formatUsers, removeUserCache } from "@modules/user/utils";

import { userProfile } from "@modules/user/services";

import { userCodeGenerate } from "@modules/common/services";

import * as interfaces from "./interfaces";
import * as constants from "./constants";
import * as utils from "./utils";

export const userUniqueCheck = async (data: interfaces.UniqueParams) => {
  const userCheck = await models.User.count({
    where: {
      [data.type]: data.value,
    },
  });
  if (!userCheck) {
    return true;
  }

  let errorMsg: string;
  switch (data.type) {
    case "email": {
      errorMsg = constants.MESSAGES.emailAlreadyTaken;
      break;
    }
    case "phone": {
      errorMsg = constants.MESSAGES.phoneAlreadyTaken;
      break;
    }
  }

  throw new ActionFailedError(errorMsg, undefined, false);
};

export const authUserResponse = async (
  userId: number
): Promise<interfaces.AuthResponse> => {
  const user = await userProfile({ id: userId });

  const auth = await utils.generateAuthJWTTokenAndCache({
    userId: user.id,
  });

  const authRes: interfaces.AuthResponse = {
    auth,
    user,
  };

  return authRes;
};

//  Signup Steps
export const signup = async (
  data: interfaces.SignupParams
): Promise<{
  userTempId: number;
  userCodeId: number;
}> => {
  const pin = await hashString(data.pin);

  let userTempId = 0;

  if (data.userTempId) {
    //  Already created the temporary user

    const userTemp = await models.UserTemp.findOne({
      where: { id: data.userTempId },
      raw: true,
    });
    if (!userTemp) {
      const result = await signup({
        ...data,
        userTempId: 0,
      });
      return result;
    }

    //  Checking phone uniqueness if phone is edited
    if (data.phone !== userTemp?.phone) {
      await userUniqueCheck({
        type: "phone",
        value: data.phone,
      });
    }

    await models.UserTemp.update(
      {
        phoneCode: data.phoneCode,
        phone: data.phone,
        pin,
      },
      {
        where: { id: data.userTempId },
      }
    );

    userTempId = data.userTempId;
  } else {
    //  First Time Signup

    //  Phone unique check
    await userUniqueCheck({
      type: "phone",
      value: data.phone,
    });

    await models.UserTemp.destroy({
      where: { phone: data.phone },
    });

    const userTemp = await models.UserTemp.create({
      name: data.name,
      phoneCode: data.phoneCode,
      phone: data.phone,
      pin,
    });

    userTempId = userTemp.id;
  }

  const userCode = await userCodeGenerate({
    userTempId,
    phoneCode: data.phoneCode,
    phone: data.phone,
    email: "",
    codeType: ICodeType.register,
  });
  const userCodeId = userCode.id;

  return {
    userTempId,
    userCodeId,
  };
};
export const signupOTP = async (
  data: interfaces.SignupOTPParams
): Promise<interfaces.AuthResponse> => {
  const userCodeQuery = {
    id: data.userCodeId,
    userTempId: data.userTempId,
    codeType: ICodeType.register,
    code: data.otp,
  };

  console.log({
    msg: "signupOTP->userCodeQuery",
    userCodeQuery,
  });

  const userCode = await models.UserCode.findOne({
    where: userCodeQuery,
    include: [{ model: models.UserTemp, as: "userTemp", required: true }],
  });
  if (!userCode) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const expIsAfter = dayJS(userCode.expiresAt).isBefore(new Date());
  if (expIsAfter) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const userTemp = userCode.userTemp as UserTempInstance;

  const user = await mysql.sequelize.transaction(async function (transaction) {
    // chain all your queries here. make sure you return them.

    const user = await models.User.create(
      {
        name: userTemp.name,
        phoneCode: userTemp.phoneCode,
        phone: userTemp.phone,
        pin: userTemp.pin,

        referalCode: generateReferalCode(),

        //@ts-ignore
        userDevices: [
          {
            deviceType: data.deviceType,
            deviceId: data.deviceId,
            fcmId: data.fcmId,
          },
        ],
      },
      {
        transaction,
        include: [{ model: models.UserDevice, as: "userDevices" }],
      }
    );

    await Promise.all([
      models.UserTemp.destroy({ where: { id: data.userTempId }, transaction }),
      models.UserCode.destroy({ where: { id: data.userCodeId }, transaction }),
    ]);

    return user;
  });

  const authRes = await authUserResponse(user.id);

  // Added to User Register Queue(Sending Welcome Email, Referal Code Used Process)
  const queueData: IUserRegisterQueueJobData = {
    kind: IUserQueueKinds.register,
    userId: user.id,
    referalCode: data.referalCode,
  };
  UserQueue.add(queueData);

  return authRes;
};

//  Login Steps
export const login = async (
  data: interfaces.LoginParams
): Promise<{
  userCodeId: number;
}> => {
  const user = await models.User.findOne({
    where: {
      phone: data.phone,
    },
    raw: true,
  });
  if (!user) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  const comparePin = await comparehash(data.pin, user.pin);
  if (!comparePin) {
    throw new ActionFailedError(MESSAGES.incorrectPin);
  }

  const userCode = await userCodeGenerate({
    userId: user.id,
    phoneCode: data.phoneCode,
    phone: data.phone,
    email: user.email,
    codeType: ICodeType.login,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const loginOTP = async (
  data: interfaces.LoginOTPParams
): Promise<interfaces.AuthResponse> => {
  const query = {
    id: data.userCodeId,
    codeType: ICodeType.login,
    code: data.otp,
  };

  console.log({
    msg: "loginOTP->query",
    query,
  });

  const userCode = await models.UserCode.findOne({
    where: query,
    include: [{ model: models.User, as: "user", required: true }],
  });
  if (!userCode) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const expIsAfter = dayJS(userCode.expiresAt).isBefore(new Date());
  if (expIsAfter) {
    throw new ActionFailedError(MESSAGES.invalidOTP);
  }

  const user = userCode.user as UserInstance;

  await Promise.all([
    models.UserCode.destroy({ where: { id: data.userCodeId } }),
    //Single Device Login Only
    models.UserDevice.update(
      {
        deviceType: data.deviceType,
        deviceId: data.deviceId,
        fcmId: data.fcmId,
      },
      {
        where: { userId: user.id },
      }
    ),
  ]);

  const authRes = await authUserResponse(user.id);

  return authRes;
};

//  Phone Change Steps
export const phoneChange = async (
  data: interfaces.PhoneChangeParams
): Promise<{
  userId: number;
}> => {
  const query = {
    phone: data.phone,
  };

  logInfo({
    msg: "phoneChange->query",
    query,
  });

  const user = await models.User.findOne({
    where: query,
  });
  if (!user) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  const comparePin = await comparehash(data.pin, user.pin);
  if (!comparePin) {
    throw new ActionFailedError(MESSAGES.incorrectPin);
  }

  return {
    userId: user.id,
  };
};
export const phoneChangeNew = async (
  data: interfaces.PhoneChangeNewParams
): Promise<{
  userCodeId: number;
}> => {
  let user = await models.User.findOne({
    where: { id: data.userId },
    raw: true,
  });
  if (!user) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  const userCode = await userCodeGenerate({
    userId: data.userId,
    phoneCode: data.phoneCode,
    phone: data.phone,
    email: user.email,
    codeType: ICodeType.phoneChange,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const phoneChangeOTP = async (
  data: interfaces.PhoneChangeOTPParams
): Promise<true> => {
  const query = {
    id: data.userCodeId,
    codeType: ICodeType.phoneChange,
    code: data.otp,
  };

  console.log({
    msg: "phoneChangeOTP->query",
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
    utils.removeAuthUserCache(userCode.userId),
    removeUserCache(userCode.userId),
  ]);

  return true;
};

//  Pin Reset Steps
export const pinReset = async (
  data: interfaces.PinResetParams
): Promise<{
  userCodeId: number;
}> => {
  const query = {
    phone: data.phone,
  };

  logInfo({
    msg: "pinReset->query",
    query,
  });

  const user = await models.User.findOne({
    where: query,
  });
  if (!user) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  await utils.userLogoutActions(user.id);

  const userCode = await userCodeGenerate({
    userId: user.id,
    phoneCode: user.phoneCode,
    phone: user.phone,
    email: user.email,
    codeType: ICodeType.pinReset,
  });
  const userCodeId = userCode.id;

  return {
    userCodeId,
  };
};
export const pinResetOTP = async (
  data: interfaces.PinResetOTPParams
): Promise<true> => {
  const query = {
    id: data.userCodeId,
    codeType: ICodeType.pinReset,
    code: data.otp,
  };

  console.log({
    msg: "pinResetOTP->query",
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
      {
        pin,
        lastSeen: seqCurrentDt(),
      },
      {
        where: { id: userCode.userId },
      }
    ),
    models.UserCode.destroy({ where: { id: data.userCodeId } }),
  ]);

  return true;
};

export const logout = async (jwtToken: string | null) => {
  try {
    if (!jwtToken) {
      return;
    }

    const decoded = (await decodeJWT(jwtToken)) as interfaces.IUserAuthJWTData;

    if (decoded.kind !== "auth") {
      return;
    }

    const userId = decoded.userId;

    if (userId) {
      //  Remove auth key from cache set
      await utils.userLogoutActions(userId);
    }
  } catch (error) {}
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminLogin = async (
  data: interfaces.AdminLoginParams
): Promise<interfaces.AuthResponse> => {
  let user = await models.User.findOne({
    where: { email: data.email },
    raw: true,
  });
  if (!user || !(user.userType & (IUserType.admin | IUserType.subAdmin))) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  const comparePin = await comparehash(data.password, user.pin);
  if (!comparePin) {
    throw new ActionFailedError(constants.MESSAGES.incorrectPassword);
  }

  user = (await formatUsers([user]))[0];

  const auth = await utils.generateAuthJWTTokenAndCache({
    userId: user.id,
  });

  const authRes: interfaces.AuthResponse = {
    auth,
    user,
  };

  return authRes;
};

export const adminPasswordForgot = async (
  data: interfaces.AdminPasswordForgotParams
) => {
  let user = await models.User.findOne({
    where: { email: data.email },
    raw: true,
  });
  if (!user || !(user.userType & (IUserType.admin | IUserType.subAdmin))) {
    throw new ActionFailedError(constants.MESSAGES.accountNotFound);
  }

  await utils.userLogoutActions(user.id);

  // Added to send Mail Queue
  const queueData: IPasswordResetMailQueueJobData = {
    kind: IEmailQueueKinds.passwordReset,
    userId: user.id,
  };
  EmailSendQueue.add(queueData);

  return;
};

export const adminPasswordReset = async (
  data: interfaces.AdminPasswordResetParams
) => {
  let decoded: interfaces.IPasswordResetJWTData;
  try {
    decoded = (await decodeJWT(data.token)) as interfaces.IPasswordResetJWTData;
  } catch (error) {
    throw new ActionFailedError(constants.MESSAGES.passwordResetLinkExpired);
  }

  const redisKey = cacheKeyDetailGenerate.passwordForgot(decoded.userId);

  const cachedToken = await cacheGet(redisKey.key);
  if (!cachedToken) {
    throw new ActionFailedError(constants.MESSAGES.passwordResetLinkExpired);
  }

  const hashedPassword = await hashString(data.newPassword);

  await Promise.all([
    models.User.update(
      {
        pin: hashedPassword,
        lastSeen: seqCurrentDt(),
      },
      {
        where: { id: decoded.userId },
      }
    ),
    cacheDelete(redisKey.key),
    utils.userLogoutActions(decoded.userId),
  ]);

  return;
};
