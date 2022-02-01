import Joi from "joi";

import { DEFAULT_PAGE_SIZE } from "@constants/constants";
import { IDeviceTypes } from "@interfaces/common";

export const CommonSchemaKeys = {
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }),
  password: Joi.string().min(6),
  deviceType: Joi.string().valid(...Object.values(IDeviceTypes)),

  phoneCode: Joi.string().label("Phone Code"),
  phone: Joi.string().max(12).label("Phone Number"),

  pin: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .label("OTP"),

  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
};

export const AddressSchemaKeys = Joi.object().keys({
  formatted: Joi.string().trim().required().label("Formatted Address"),
  line1: Joi.string().trim().allow("").optional().label("Line 1"),
  line2: Joi.string().trim().allow("").optional().label("Line 2"),
  city: Joi.string().trim().allow("").optional().label("City"),
  state: Joi.string().trim().allow("").optional().label("State"),
  zipCode: Joi.string().trim().allow("").optional().label("Zip Code"),
  country: Joi.string().trim().allow("").optional().label("Country"),
  latitude: CommonSchemaKeys.latitude.required().label("Latitude"),
  longitude: CommonSchemaKeys.longitude.required().label("Longitude"),
});

export const ListingSchemaKeys = {
  limit: Joi.number().optional().default(DEFAULT_PAGE_SIZE),
  offset: Joi.number().min(0).optional().default(0),
  search: Joi.string().optional().allow("").default(null),

  startDt: Joi.date().iso().optional(),
  endDt: Joi.when("startDt", {
    is: Joi.exist(),
    then: Joi.date().iso().min(Joi.ref("startDt")).required(),
    otherwise: Joi.forbidden(),
  }),
};
