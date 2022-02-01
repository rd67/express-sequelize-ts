import Joi from "joi";

export const languagesAdd = {
  body: Joi.object().keys({
    languages: Joi.array()
      .items(Joi.number().min(1).required())
      .unique()
      .min(1)
      .required(),
  }),
};
