import dotenv from "dotenv";

import * as interfaces from "./interfaces";

dotenv.config();

const env = (process.env.NODE_ENV ||
  "development") as interfaces.IEnvEnvironment;

export const otherConfig: interfaces.IOtherConfig = {
  fakeLatency: Number(process.env.FAKE_LATENCY ?? "0"),
};

const redisConfig: interfaces.IRedisConfig = {
  url: process.env.REDIS_URL as string,
  rateLimit: Number(process.env.RATE_LIMIT ?? "50"),
};

export const awsConfig: interfaces.IAwsConfig = {
  accessId: process.env.AWS_ACCESS_ID || "",
  secretKey: process.env.AWS_SECRET_KEY || "",
  s3Bucket: process.env.S3_BUCKET || "",
  region: process.env.AWS_REGION || "",
};

export const emailConfig: interfaces.IEmailConfig = {
  provider: "ses",
  fromEmail: process.env.EMAIL_FROM as string,
};

export const dbConfig: interfaces.IDbConfig = {
  host: process.env.DB_HOST as string,
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  pool: {
    min: 0,
    max: 5,
  },
};
// export const uploadUtil = process.env.UPLOAD_UTIL || 'local';
// export const emailUtil = process.env.EMAIL_UTIL || 'ses';

// //Note: this email needs to be verified for sending mail
// export const fromEmail = process.env.FROM_EMAIL || 'no-reply@max360.com';

const development: interfaces.IConfig = {
  app: {
    isProduction: false,
    environment: "development",
    port: 3333,
    secretKey: process.env.SECRET_KEY as string,
  },
  other: otherConfig,
  redis: redisConfig,
  aws: awsConfig,
  email: emailConfig,
  db: dbConfig,
};

const production: interfaces.IConfig = {
  app: {
    isProduction: true,
    environment: "production",
    port: 3334,
    secretKey: process.env.SECRET_KEY as string,
  },
  other: otherConfig,
  redis: redisConfig,
  aws: awsConfig,
  email: emailConfig,
  db: dbConfig,
};

const config: Record<interfaces.IEnvEnvironment, interfaces.IConfig> = {
  development,
  production,
};

export default config[env];
