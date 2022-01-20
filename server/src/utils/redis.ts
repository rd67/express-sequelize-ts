import Redis from "ioredis";
import ms from "ms";
import chalk from "chalk";

import config from "@config/config";

const DefaultTimeoutRedis = ms("1d") / 1000;
const DefaultExpiryMode: "PX" | "EX" = "PX"; // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set

export const clientRedis = new Redis(config.redis.url);

clientRedis.on("connect", function () {
  const name = chalk.cyan("Redis Client");
  console.log(`${name} Connection has been established successfully.`);
});

clientRedis.on("error", function (err) {
  console.log(`${chalk.red("Redis Error:")} Something went wrong ${err}`);
});

/**
 *
 * @param key
 * @param data
 */
export const cacheSet = async (
  key: string,
  data: any,
  exMode = DefaultExpiryMode,
  timeoutRedis = DefaultTimeoutRedis
): Promise<void> => {
  await clientRedis.set(key, JSON.stringify(data), exMode, timeoutRedis);
};

/**
 *
 * @param key
 * @returns
 */
export const cacheGet = async (key: string): Promise<any> => {
  const data = await clientRedis.get(key);

  if (!data) {
    return null;
  }

  const parseData = JSON.parse(data);
  return parseData;
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

// import Redis, { Redis as RedisClient } from "ioredis";
// import ms from "ms";
// import chalk from "chalk";

// import config from "@config/config";

// const DefaultTimeoutRedis = ms("1d") / 1000;
// const DefaultExpiryMode: "PX" | "EX" = "PX"; // PX = miliseconds || EX = seconds. full documentation https://redis.io/commands/set

// class RedisProvider {
//   private readonly client: RedisClient;

//   constructor() {
//     const clientRedis = new Redis(config.redis.url);

//     clientRedis.on("connect", function () {
//       const name = chalk.cyan("Redis Client");
//       console.log(`${name} Connection has been established successfully.`);
//     });

//     clientRedis.on("error", function (err) {
//       console.log(`${chalk.red("Redis Error:")} Something went wrong ${err}`);
//     });

//     this.client = clientRedis;
//   }

//   /**
//    *
//    * @param key
//    * @param data
//    */
//   public async set(
//     key: string,
//     data: any,
//     exMode = DefaultExpiryMode,
//     timeoutRedis = DefaultTimeoutRedis
//   ): Promise<void> {
//     await this.client.set(key, JSON.stringify(data), exMode, timeoutRedis);
//   }

//   /**
//    *
//    * @param key
//    * @returns
//    */
//   public async get<T>(key: string): Promise<T | null> {
//     const data = await this.client.get(key);

//     if (!data) {
//       return null;
//     }

//     const parseData = JSON.parse(data) as T;
//     return parseData;
//   }

//   /**
//    *
//    * @param key
//    */
//   public async delete(key: string): Promise<void> {
//     await this.client.del(key);
//   }

//   /**
//    *
//    * @param prefix
//    */
//   public async deleteByPrefix(prefix: string): Promise<void> {
//     const keys = await this.client.keys(`${prefix}:*`);

//     const pipeline = this.client.pipeline();

//     keys.forEach((key: string) => {
//       pipeline.del(key);
//     });

//     await pipeline.exec();
//   }
// }

// export default new RedisProvider();
