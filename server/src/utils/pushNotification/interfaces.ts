import { IDeviceTypes } from "@interfaces/common";

export interface ISendPushParams {
  reqId: string;

  fcmId: string;
  deviceType: IDeviceTypes.android | IDeviceTypes.ios;

  // message: string;

  data: {
    message: string;
  } & any;
}
