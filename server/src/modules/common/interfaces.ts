import { IDeviceTypes } from "@interfaces/common";

export interface TestNotificationParams {
  reqId: string;
  deviceType: IDeviceTypes.android | IDeviceTypes.ios;
  deviceId: string;
  fcmId: string;
}

//  Pre signed URl
export interface PreSignedURLsCreateParams {
  moduleKind: "Cat";

  contentType: string;
}
