import Joi from "joi";

import { IDeviceTypes } from "@interfaces/common";

export const decodeJWTToken = {
  params: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const testNotification = {
  body: Joi.object().keys({
    deviceType: Joi.string()
      .valid(IDeviceTypes.ios, IDeviceTypes.android)
      .required(),
    deviceId: Joi.string().default(null).required(),
    fcmId: Joi.string().default(null).required(),
  }),
};

export const preSignedURLs = {
  body: Joi.object().keys({
    moduleKind: Joi.string().valid("Cat").required(),

    contentType: Joi.string()
      // .optional()
      // .valid('image/png', 'image/jpg', 'image/jpeg')
      .required(),
  }),
};
