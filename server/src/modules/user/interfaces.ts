import { IAddressKind, InputAddress } from "@interfaces/addresses";
import { CommonListParams } from "@interfaces/common";

export interface ProfileUpdateParams {
  name: string;

  profilePic: string;
  coverPic: string;
  dob: string;
  tagline: string;
  description: string;
}

export interface OUserProfileParams {
  oUserId: number;
}

export interface AddressUpdateParams {
  kind: IAddressKind;
  address: InputAddress;
}

//  Phone Change Steps
export interface PhoneUpdateParams {
  phoneCode: string;
  phone: string;

  pin: number;
}
export interface PhoneUpdateOTPParams {
  userCodeId: number;
  otp: number;
}

//  Email Change Steps
export interface EmailUpdateParams {
  email: string;

  pin: number;
}
export interface EmailUpdateOTPParams {
  userCodeId: number;
  otp: number;
}

//  Pin Update Steps
export interface PinUpdateParams {
  phone: string;
}
export interface PinUpdateOTPParams {
  userCodeId: number;
  otp: number;

  pin: number;
}

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export interface AdminUsersListParams extends CommonListParams {}
