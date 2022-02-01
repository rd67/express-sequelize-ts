import { ICodeType } from "@interfaces/userCodes";

import { DefaultAppVersioning } from "@constants/settings";

import { generateOTP, roundNumber } from "@helpers/common";
import { addDateTime } from "@helpers/date";

import { localize } from "@utils/i18n";
import { sendSMS } from "@utils/sms";
import { keyGenerator } from "@utils/upload";
import { preSignedURL } from "@utils/upload/s3";
import { pushNotification } from "@utils/index";

import models from "@models/index";

import * as interfaces from "./interfaces";
import * as constants from "./constants";

export const settings = async () => {
  let settings = await models.Setting.findOne();

  return {
    versioning: settings?.versioning ?? DefaultAppVersioning,
  };
};

export const userCodeGenerate = async ({
  userId = 1, // 1 is the default user created
  userTempId = 1, // 1 is the default userTemp created
  phoneCode,
  phone,
  email,

  codeType,

  inValidate = true,
  sendSMSOTP = true,
  sendSMSEmail = false,
}: {
  userId?: number;
  userTempId?: number;
  phoneCode: string;
  phone: string;
  email: string;
  codeType: ICodeType;

  inValidate?: boolean;
  sendSMSOTP?: boolean;
  sendSMSEmail?: boolean;
}) => {
  if (inValidate) {
    //  Invalidate the previous unverified Codes
    await models.UserCode.destroy({
      where: {
        userId,
        userTempId,
        codeType,
      },
    });
  }

  const code = generateOTP();
  const expiresAt = addDateTime(undefined, 3, "minute");

  const userCode = await models.UserCode.create({
    userId,
    userTempId,

    phoneCode,
    phone,

    email,

    code,

    codeType,

    expiresAt,
  });

  //Sending SMS OTP Filter
  if (sendSMSOTP) {
    const message = localize.__(constants.MESSAGES.otpMessage, {
      code: `${code}`,
    });

    await sendSMS({
      phoneCode,
      phone,
      message,
    });
  }

  //  Sending SMS Email
  if (sendSMSEmail) {
  }

  return userCode;
};

export const testNotification = async (
  userId: number,
  data: interfaces.TestNotificationParams
) => {
  //  Replacing User Device Details, since only one Device login is permitted
  await models.UserDevice.update(
    {
      deviceId: data.deviceId,
      deviceType: data.deviceType,
      fcmId: data.fcmId,
    },
    {
      where: {
        userId,
      },
    }
  );

  const message = localize.__(constants.MESSAGES.testNotification, {});

  //  Send Push
  const result = await pushNotification.sendPush({
    reqId: data.reqId,

    deviceType: data.deviceType,
    fcmId: data.fcmId,

    data: {
      message,
    },
  });

  return result;
};

export const preSignedURLs = async (
  data: interfaces.PreSignedURLsCreateParams
) => {
  let commonPrefix = "";
  let filePrefix = "";

  if (
    //  Making users profile pic, open to access
    data.moduleKind === "Cat"
  ) {
    commonPrefix = `public/categories`;
  }

  const { key } = keyGenerator(commonPrefix, data.contentType, filePrefix);

  const media = await preSignedURL(key);

  return {
    media: media.key,
    mediaURL: media.url,
  };
};
