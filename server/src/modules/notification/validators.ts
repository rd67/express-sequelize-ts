import Joi from "joi";

import { ListingSchemaKeys } from "@constants/validation";

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

export const adminNotificationList = {
  query: Joi.object().keys({
    limit: ListingSchemaKeys.limit.required(),
    offset: ListingSchemaKeys.offset.required(),
  }),
};
