import Queue, { Job } from "bull";
import chalk from "chalk";

import { redisConfig } from "@config/config";

import { logInfo } from "@helpers/common";

import { logger } from "@utils/logger";

import * as interfaces from "./interfaces";

export enum INotificationQueueKinds {
  newChat = "NEW_CHAT",
  other = "OTHER",
}

//  Password Reset Types
export interface INewChatNotificationQueueJobData {
  kind: INotificationQueueKinds.newChat;
  chatMessageId: number;
}
type INotificationQueueData = INewChatNotificationQueueJobData;

//  Email Queue
export const NotificationQueue = new Queue(
  interfaces.IQueueKinds.notification,
  redisConfig.url
);
const name = chalk.cyan("🌿Notification Queue");
console.log(`${name} has been started successfully.`);

const newChatNotificationFunc = async (
  data: INewChatNotificationQueueJobData
) => {};

//TODO Add Notification on error
NotificationQueue.process(async (job: Job) => {
  try {
    let data: INotificationQueueData = job.data;

    logInfo({
      message: interfaces.IQueueKinds.notification,
      data,
    });

    let result: any = null;
    switch (data.kind) {
      case INotificationQueueKinds.newChat: {
        result = await newChatNotificationFunc(data);
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
