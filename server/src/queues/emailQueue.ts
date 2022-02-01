import Queue, { Job } from "bull";
import hbs from "hbs";
import chalk from "chalk";
import { readFile } from "fs/promises";

import { IDeviceTypes } from "@interfaces/common";
import config, { redisConfig, panelURL } from "@config/config";

import { logInfo } from "@helpers/common";
import { cacheKeyDetailGenerate } from "@helpers/cache";

import { ISendEmailParams } from "@utils/mail/interfaces";
import { encodeJWT } from "@utils/jsonWebToken";
import { cacheSet } from "@utils/redis";
import { sendEmail } from "@utils/mail";
import { localize } from "@utils/i18n";
import { logger } from "@utils/logger";

import { formatUsers } from "@modules/user/utils";
import { getOneUser } from "@modules/user/services";
import { IPasswordResetJWTData } from "@modules/auth/interfaces";

import * as interfaces from "./interfaces";

export enum IEmailQueueKinds {
  passwordReset = "PASSWORD_RESET",
}

//  Password Reset Types
export interface IPasswordResetMailQueueJobData {
  kind: IEmailQueueKinds.passwordReset;
  userId: number;
  //These are added in each mail Func individually
  subject?: string;
  from?: string;
}
interface IPasswordResetMailQueueMergeVar {
  subject: string;
  link: string;

  user: {
    name: string;
    email: string;
  };

  product: {
    name: string;
    logo: string;
    logoMini: string;
  };
}

type IEmailSendQueueData = IPasswordResetMailQueueJobData;

//  Email Queue
export const EmailSendQueue = new Queue(
  interfaces.IQueueKinds.email,
  redisConfig.url
);
const name = chalk.cyan("🌿Email Queue");
console.log(`${name} has been started successfully.`);

// const readTemplateAndCache = async (path: string, kind: string) => {
//   const redisKey = cacheKeyDetailGenerate.template(kind);

//   let htmlCode = await cacheGet(redisKey);

//   if (!htmlCode) {
//     htmlCode = await readFile(path, {
//       encoding: "utf-8",
//     });

//     await cacheSet(redisKey, htmlCode);
//   }

//   return htmlCode;
// };

const passwordResetFunc = async (data: IPasswordResetMailQueueJobData) => {
  const { userId } = data;

  const currentUser = await getOneUser({ id: userId });
  const user = (await formatUsers([currentUser]))[0];

  data.subject = localize.__("Password Reset");

  const passwordForgotCacheKey = cacheKeyDetailGenerate.passwordForgot(userId);

  const userJWTData: IPasswordResetJWTData = {
    kind: IEmailQueueKinds.passwordReset,
    userId,

    // name: user.name,

    // email: user.email,

    deviceType: IDeviceTypes.web,
  };

  const token = encodeJWT(userJWTData, {
    expiresIn: passwordForgotCacheKey.ex,
  });

  const mergeVariables: IPasswordResetMailQueueMergeVar = {
    subject: data.subject,
    link: `${panelURL}/passwordReset/${token}`,

    user: {
      name: user.name,
      email: user.email,
    },

    product: {
      name: config.app.name,
      logo: config.app.logo,
      logoMini: config.app.logoMini,
    },
  };
  // const htmlCode = await readTemplateAndCache(
  //   `../views/emails/passwordReset.hbs`,
  //   data.kind
  // );

  const htmlCode = await readFile(
    `${__dirname}/../views/emails/passwordReset.hbs`,
    {
      encoding: "utf-8",
    }
  );

  //@ts-ignore
  const template = hbs.compile(htmlCode);
  const message = template(mergeVariables);

  //  Set Reset Token Cache Key
  await cacheSet(
    passwordForgotCacheKey.key,
    JSON.stringify(userJWTData),
    "EX",
    passwordForgotCacheKey.ex
  );

  const mailSendData: ISendEmailParams = {
    to: user.email,
    from: data.from,
    subject: data.subject,
    message,
  };

  const mailSent = await sendEmail(mailSendData, mergeVariables);

  return mailSent;
};

//TODO Add Notification on error
EmailSendQueue.process(async (job: Job) => {
  try {
    let data: IEmailSendQueueData = job.data;

    logInfo({
      message: interfaces.IQueueKinds.email,
      data,
    });

    let result: any = null;
    switch (data.kind) {
      case IEmailQueueKinds.passwordReset: {
        result = await passwordResetFunc(data);
        if (result !== false) {
          job.progress(100);
        }

        break;
      }
    }

    return result;
  } catch (error) {
    logger.error(error);
    throw error;
  }
});
