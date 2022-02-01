import SESPackage, { SendEmailRequest } from "aws-sdk/clients/ses";

import { awsConfig, emailConfig } from "@config/config";

import { logger } from "@utils/logger";

import { logInfo } from "@helpers/common";

import * as interfaces from "./interfaces";

const SES = new SESPackage({
  accessKeyId: awsConfig.accessId,
  secretAccessKey: awsConfig.secretKey,
  region: awsConfig.region,
  apiVersion: "2010-12-01",
});

export const sendEmail = (
  {
    to,
    from = emailConfig.fromEmail,
    subject,
    message,
  }: interfaces.ISendEmailParams,
  mergeVariables: any = {}
) => {
  const params: SendEmailRequest = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        /* replace Html attribute with the following if you want to send plain text emails. 
            Text: {
                Charset: "UTF-8",
                Data: message
            }
         */
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    ReturnPath: from,
    Source: from,
  };

  const sendEmail = SES.sendEmail(params).promise();

  return sendEmail
    .then((data) => {
      const result = {
        to,
        subject,
        from,
        data,
        link: mergeVariables?.["link"],
      };

      logInfo({
        msg: "Email submitted to SES",
        result,
      });

      return result;
    })
    .catch(logger.error);
};
