import { signedURL } from "@utils/upload";

import { MediaInstance } from "@models/medias";

export const formatMedias = async (medias: MediaInstance[]) => {
  const formatted: MediaInstance[] = [];

  medias = JSON.parse(JSON.stringify(medias));

  for (let media of medias) {
    media.mediaURL = await signedURL(media.media);

    formatted.push(media);
  }

  return formatted;
};
