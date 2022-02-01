import firebaseAdmin from "firebase-admin";
import { getMessaging, Message } from "firebase-admin/messaging";

import { STATUS_CODES } from "@constants/constants";

import { logInfo } from "@helpers/common";

// Fetching the service account key JSON file contents
const firebaseSDKConfig = require("./firebaseSDKConfig.json");

import * as interfaces from "./interfaces";

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseSDKConfig),
});

//https://www.benmvp.com/blog/initializing-firebase-admin-node-sdk-env-vars/
//https://firebase.google.com/docs/cloud-messaging/send-message
export const sendPush = async (data: interfaces.ISendPushParams) => {
  if (!data.fcmId) {
    return;
  }

  const message: Message = {
    data: data.data,
    token: data.fcmId,
  };

  try {
    // Send a message to the device corresponding to the provided registration token.
    const result = await getMessaging().send(message);

    logInfo({
      msg: `sendPush-fcm`,
      reqId: data.reqId,
      result,
    });

    return {
      status: true,
      result,
    };
  } catch (error: any) {
    return {
      status: STATUS_CODES.ERROR,
      message: error.message,
    };
  }
};
