import Joi from "joi";

import { IMediaKind } from "@interfaces/medias";

export const mediaAdd = {
  body: Joi.object().keys({
    media: Joi.string().required(),

    kind: Joi.string()
      // .valid(...Object.values(IMediaKind))
      .valid(IMediaKind.portfolio)
      .required(),
  }),
};

export const mediasList = {
  query: Joi.object().keys({
    kind: Joi.string()
      // .valid(...Object.values(IMediaKind))
      .valid(IMediaKind.portfolio)
      .required(),
  }),
};

export const mediaDelete = {
  query: Joi.object().keys({
    kind: Joi.string()
      // .valid(...Object.values(IMediaKind))
      .valid(IMediaKind.portfolio)
      .required(),

    mediaId: Joi.number().required(),
  }),
};
