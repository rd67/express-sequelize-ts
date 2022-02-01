import { cacheKeyDetailGenerate } from "@helpers/cache";

import { cacheHashAdd } from "@utils/redis";

export const socketIdCacheAdd = async (userId: number, socketId: string) => {
  const socketCacheKeyName = cacheKeyDetailGenerate.socket();

  //  Add Socket Id to Cache
  await cacheHashAdd(
    socketCacheKeyName,
    `${userId}`,
    JSON.stringify([socketId])
  );
};

export const socketIdCacheRemove = (userId: number, socketId: string) => {
  // const socketCacheKeyName = cacheKeyDetailGenerate.socket();
};
