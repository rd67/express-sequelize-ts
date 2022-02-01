import { uploadBaseURL } from "@utils/upload";
import { cacheDelete } from "@utils/redis";

import { cacheKeyDetailGenerate } from "@helpers/cache";

import { UserInstance } from "@models/users";
import { formatMedias } from "@modules/media/utils";

export const formatUsers = async (users: UserInstance[]) => {
  const formatted: UserInstance[] = [];

  users = JSON.parse(JSON.stringify(users));

  const baseURL = uploadBaseURL();

  for (let user of users) {
    //@ts-ignore
    user["profilePicURL"] = user.profilePic
      ? `${baseURL}/${user.profilePic}`
      : "";

    if (user.coverPic) {
      //@ts-ignore
      user["coverPicURL"] = `${baseURL}/${user.coverPic}`;
    }

    //  Formatting Portfolio
    if (user.portfolio) {
      user.portfolio = await formatMedias(user.portfolio);
    }

    //@ts-ignore
    delete user.pin;

    formatted.push(user);
  }

  return formatted;
};

//Removing user from cache.
export const removeUserCache = (userId: number | null) => {
  if (userId === null) {
    return;
  }

  return cacheDelete(cacheKeyDetailGenerate.user(userId));
};
