import { IDeviceTypes } from "./common";

export interface UserDevicesAttributes {
  id: number;

  userId: number;

  deviceType: IDeviceTypes;

  deviceId: string | null;
  fcmId: string | null;

  createdAt: Date;
  updatedAt: Date;
}
