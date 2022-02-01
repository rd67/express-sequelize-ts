import { IDeviceTypes } from "@interfaces/common";

import { UserInstance } from "@models/users";

import { IEmailQueueKinds } from "@queues/emailQueue";

export interface UniqueParams {
  type: "email" | "phone";
  value: string | number;
}

export interface DeviceDetails {
  deviceType: IDeviceTypes;
  deviceId?: string;
  fcmId?: string;
}

export interface IUserAuthJWTData {
  kind: "auth";
  userId: number;
}
// export interface IUserAuthJWTData extends UserInstance {
//   kind: "auth";
// }

export interface AuthResponse {
  auth: {
    token: string;
    expiry: number;
  };
  user: UserInstance;
}

export interface SignupParams {
  userTempId: number;

  name: string;

  phoneCode: string;
  phone: string;

  pin: number;
}
export interface SignupOTPParams {
  userTempId: number;

  userCodeId: number;
  otp: number;

  deviceType: IDeviceTypes;
  fcmId?: string;
  deviceId: string;

  referalCode?: string;
}

export interface LoginParams {
  phoneCode: string;
  phone: string;

  pin: number;
}
export interface LoginOTPParams {
  userCodeId: number;
  otp: number;

  deviceType: IDeviceTypes;
  fcmId?: string;
  deviceId?: string;
}

export interface PhoneChangeParams {
  phoneCode: string;
  phone: string;

  pin: number;
}
export interface PhoneChangeNewParams {
  userId: number;

  phoneCode: string;
  phone: string;
}

export interface PhoneChangeOTPParams {
  userCodeId: number;
  otp: number;
}

export interface PinResetParams {
  phone: string;
}
export interface PinResetOTPParams {
  userCodeId: number;
  otp: number;

  pin: number;
}

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export interface AdminLoginParams {
  email: string;
  password: string;

  deviceType: IDeviceTypes.web;
}

export interface AdminPasswordForgotParams {
  email: string;
}

export interface IPasswordResetJWTData extends DeviceDetails {
  kind: IEmailQueueKinds.passwordReset;

  userId: number;

  // name: string;
  // email: string;
}

export interface AdminPasswordResetParams {
  token: string;
  newPassword: string;
}
