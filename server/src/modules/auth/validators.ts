import Joi from "joi";

import { CommonSchemaKeys } from "@constants/validation";
import { IDeviceTypes } from "@interfaces/common";

export const unique = {
  body: Joi.object().keys({
    type: Joi.string().valid("email", "phone").required(),

    value: Joi.when(Joi.ref("type"), {
      is: "email",
      then: CommonSchemaKeys.email,
    })
      .when(Joi.ref("type"), {
        is: "phone",
        then: CommonSchemaKeys.phone,
      })
      .required(),
  }),
};

//  Signup Steps
export const signup = {
  body: Joi.object().keys({
    userTempId: Joi.number().default(0).optional(),

    name: Joi.string().required(),
    phoneCode: CommonSchemaKeys.phoneCode.required(),
    phone: CommonSchemaKeys.phone.required(),
    pin: CommonSchemaKeys.pin.required(),

    referalCode: Joi.string().optional(),
  }),
};
export const signupOTP = {
  body: Joi.object().keys({
    userTempId: Joi.number().required(),

    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),

    deviceType: Joi.string()
      .valid(IDeviceTypes.ios, IDeviceTypes.android)
      .required(),
    deviceId: Joi.string().default(null).optional(),
    fcmId: Joi.string().default(null).optional(),
  }),
};

//  Login Steps
export const login = {
  body: Joi.object().keys({
    phoneCode: CommonSchemaKeys.phoneCode.required(),
    phone: CommonSchemaKeys.phone.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};
export const loginOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),

    deviceType: Joi.string()
      .valid(IDeviceTypes.ios, IDeviceTypes.android)
      .required(),
    deviceId: Joi.string().default(null).optional(),
    fcmId: Joi.string().default(null).optional(),
  }),
};

//  Phone Change Steps
export const phoneChange = {
  body: Joi.object().keys({
    phoneCode: CommonSchemaKeys.phoneCode.required(),
    phone: CommonSchemaKeys.phone.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};
export const phoneChangeNew = {
  body: Joi.object().keys({
    userId: Joi.number().required(),

    phoneCode: CommonSchemaKeys.phoneCode.required(),
    phone: CommonSchemaKeys.phone.required(),
  }),
};
export const phoneChangeOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),
  }),
};

//  Pin Reset Steps
export const pinReset = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
  }),
};
export const pinResetOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminLogin = {
  body: Joi.object().keys({
    email: CommonSchemaKeys.email.required(),
    password: CommonSchemaKeys.password.required(),

    deviceType: Joi.string()
      .valid(...Object.values(IDeviceTypes))
      .required(),
  }),
};

export const adminPasswordForgot = {
  body: Joi.object().keys({
    email: CommonSchemaKeys.email.required(),
  }),
};

export const adminPasswordReset = {
  body: Joi.object().keys({
    token: Joi.string().min(6).required(),
    newPassword: CommonSchemaKeys.password.label("New Password").required(),
  }),
};
