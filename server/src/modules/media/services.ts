import { NotFoundError } from "@helpers/errors";

import models from "@models/index";

import * as constants from "./constants";
import * as interfaces from "./interfaces";

export const mediaAdd = async (
  userId: number,
  data: interfaces.MediaAddParams
) => {
  const media = await models.Media.create({
    userId,
    media: data.media,
    kind: data.kind,
  });

  return media;
};

export const mediasList = async (
  userId: number,
  data: interfaces.MediasListParams
) => {
  const medias = await models.Media.findAll({
    where: {
      userId,
      kind: data.kind,
    },
    attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
  });

  return medias;
};

export const mediaDelete = async (
  userId: number,
  data: interfaces.MediaDeleteParams
) => {
  const media = await models.Media.destroy({
    where: {
      userId,
      kind: data.kind,
      id: data.mediaId,
    },
  });
  if (!media) {
    throw new NotFoundError(constants.MESSAGES.notFound);
  }

  return true;
};
