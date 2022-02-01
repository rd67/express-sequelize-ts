import axios, { AxiosRequestConfig } from "axios";

import { smsConfig } from "@config/config";

import { logInfo } from "@helpers/common";
import { logger } from "@utils/logger";

import * as interfaces from "./interfaces";

export const sendSMS = async ({
  phoneCode,
  phone,

  message,
}: interfaces.ISendSMSParams) => {
  const phoneNumber = `${phoneCode}${phone}`;

  message = encodeURI(message);

  const config: AxiosRequestConfig = {
    method: "get",
    url: `http://gatewayd2.onewaysms.sg:10002/api.aspx?apiusername=${smsConfig.username}&apipassword=${smsConfig.password}&mobileno=${phoneNumber}&senderid=onewaysms&languagetype=1&message=${message}`,
    // headers: {},
  };

  try {
    const result = await axios(config);

    logInfo({
      msg: `Your message has been delivered.`,
      data: result.data,
      config,
    });
  } catch (error) {
    logger.error(error);
  }
};
