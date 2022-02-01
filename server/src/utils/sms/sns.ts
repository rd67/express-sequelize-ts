import SNSPackage, { PublishInput } from "aws-sdk/clients/sns";

import config, { awsConfig } from "@config/config";

import { logInfo } from "@helpers/common";
import { logger } from "@utils/logger";

import * as interfaces from "./interfaces";

const SNS = new SNSPackage({
  accessKeyId: awsConfig.accessId,
  secretAccessKey: awsConfig.secretKey,
  region: awsConfig.region,
  apiVersion: "2010-03-31",
});

export const sendSMS = async ({
  phoneCode,
  phone,

  message,
}: interfaces.ISendSMSParams) => {
  const params: PublishInput = {
    PhoneNumber: `${phoneCode}${phone}`,
    Message: message,

    Subject: config.app.name,
    // MessageAttributes: {
    //   "AWS.SNS.SMS.SenderID": {
    //     DataType: "String",
    //     StringValue: "OTP",
    //   },
    // },
  };

  try {
    const { MessageId } = await SNS.publish(params).promise();

    logInfo({
      msg: `Your message with id ${MessageId} has been delivered.`,
      params,
    });
  } catch (error) {
    logger.error(error);
  }
};
