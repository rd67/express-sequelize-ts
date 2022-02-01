import Queue, { Job } from "bull";
import chalk from "chalk";

import { redisConfig } from "@config/config";

import { logInfo } from "@helpers/common";

import { logger } from "@utils/logger";

import models from "@models/index";

import * as interfaces from "./interfaces";

export enum IUserQueueKinds {
  register = "USER_REGISTER",
}

//  Password Reset Types
export interface IUserRegisterQueueJobData {
  kind: IUserQueueKinds.register;
  userId: number;
  referalCode?: string;
}
type IUserQueueData = IUserRegisterQueueJobData;

//  Email Queue
export const UserQueue = new Queue(
  interfaces.IQueueKinds.user,
  redisConfig.url
);
const name = chalk.cyan("🌿User Queue");
console.log(`${name} has been started successfully.`);

const userRegisterFunc = async (data: IUserRegisterQueueJobData) => {
  //  Make History of Referal Code
  const referalCodeProcessFunc = async () => {
    if (!data.referalCode) {
      return;
    }

    const parentUser = await models.User.findOne({
      where: {
        referalCode: data.referalCode,
      },
    });
    if (!parentUser) {
      return;
    }

    await models.UserReferal.create({
      userId: parentUser.id,
      oUserId: data.userId,
    });
  };

  await referalCodeProcessFunc();
};

//TODO Add User on error
UserQueue.process(async (job: Job) => {
  try {
    let data: IUserQueueData = job.data;

    logInfo({
      message: interfaces.IQueueKinds.user,
      data,
    });

    let result: any = null;
    switch (data.kind) {
      case IUserQueueKinds.register: {
        result = await userRegisterFunc(data);
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
