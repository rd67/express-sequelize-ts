import {
  AddressSchemaKeys,
  CommonSchemaKeys,
  ListingSchemaKeys,
} from "@constants/validation";
import { IAddressKind } from "@interfaces/addresses";
import Joi from "joi";

export const profileUpdate = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    profilePic: Joi.string().default("").optional(),
    coverPic: Joi.string().default("").optional(),
    dob: Joi.date().iso().optional(), //.options({ convert: false })
    description: Joi.string().default("").optional(),
  }),
};

export const oUserProfile = {
  params: Joi.object().keys({
    oUserId: Joi.number().required(),
  }),
};

export const languageUpdate = {
  params: Joi.object().keys({
    languageId: Joi.number().required(),
  }),
};

export const addressUpdate = {
  body: Joi.object().keys({
    kind: Joi.string()
      .valid(...Object.values(IAddressKind))
      .required(),
    address: AddressSchemaKeys.required(),
  }),
};

//  Phone Change Steps
export const phoneUpdate = {
  body: Joi.object().keys({
    phoneCode: CommonSchemaKeys.phoneCode.required(),
    phone: CommonSchemaKeys.phone.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};
export const phoneUpdateOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),
  }),
};

//  Email Change Steps
export const emailUpdate = {
  body: Joi.object().keys({
    email: CommonSchemaKeys.email.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};
export const emailUpdateOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),
  }),
};

//  Pin Change Steps
export const pinUpdate = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
  }),
};
export const pinUpdateOTP = {
  body: Joi.object().keys({
    userCodeId: Joi.number().required(),

    otp: CommonSchemaKeys.otp.required(),

    pin: CommonSchemaKeys.pin.required(),
  }),
};

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminUsersList = {
  query: Joi.object().keys({
    ...ListingSchemaKeys,
  }),
};
