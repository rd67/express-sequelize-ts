import Redis, { BooleanResponse } from "ioredis";
import chalk from "chalk";

import { redisConfig } from "@config/config";

const DefaultTimeoutRedis = 60 * 60 * 24; //1 Day

export const clientRedis = new Redis(redisConfig.url);

clientRedis.on("connect", function () {
  const name = chalk.cyan("🌿Redis Client");
  console.log(`${name} Connection has been established successfully.`);
});

clientRedis.on("error", function (err) {
  console.log(`❌${chalk.red("Redis Error:")} Something went wrong ${err}`);
});

/**
 *
 * @param key
 * @param data
 */
export const cacheSet = async (
  key: string,
  data: string,
  // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set
  exMode: "PX" | "EX" = "PX",
  timeoutRedis = DefaultTimeoutRedis
): Promise<void> => {
  await clientRedis.set(key, data, exMode, timeoutRedis);
};

/**
 *
 * @param key
 * @returns
 */
export const cacheGet = async (key: string): Promise<any> => {
  const data = await clientRedis.get(key);

  return data;
};

/**
 *
 * @param key
 */
export const cacheDelete = async (key: string): Promise<void> => {
  await clientRedis.del(key);
};

/**
 *
 * @param prefix
 */
export const cacheDeleteByPrefix = async (prefix: string): Promise<void> => {
  const keys = await clientRedis.keys(`${prefix}:*`);

  const pipeline = clientRedis.pipeline();

  keys.forEach((key: string) => {
    pipeline.del(key);
  });

  await pipeline.exec();
};

/**
 *
 * @param key
 * @param data
 * This one is setting a cache object
 */
export const cacheSetMember = async (
  key: string,
  data: string
): Promise<void> => {
  await clientRedis.sadd(key, data);
};

/**
 *
 * @param key
 * @param data
 * This one is checking if a key is present in the cache object
 */
export const cacheCheckMember = (
  key: string,
  member: string
): Promise<BooleanResponse> => {
  return clientRedis.sismember(key, member);
};

/**
 *
 * @param key
 * @param data
 * @param value
 * This one is setting a cache object
 */
export const cacheHashAdd = async (
  key: string,
  data: string,
  value: string
): Promise<void> => {
  await clientRedis.hset(key, data, value);
};
