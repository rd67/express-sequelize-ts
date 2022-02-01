import dotenv from "dotenv";

import * as interfaces from "./interfaces";

dotenv.config();

const env = (process.env.NODE_ENV ||
  "development") as interfaces.IEnvEnvironment;

const port = Number(process.env.PORT || "3333");

const uploadUtil = (process.env.UPLOAD_UTIL ||
  "local") as interfaces.IUploadUtilType;
const emailUtil = (process.env.EMAIL_UTIL ||
  "ses") as interfaces.IEmailUtilType;

export const baseURL = process.env.BASE_URL as string;

export const panelURL = process.env.PANEL_URL as string;
export const defaultPassword =
  process.env.DEFAULT_ADMIN_PASSWORD || "Core2Duo@1";

const logo = `${baseURL}/logos/logo.png`;
const logoMini = `${baseURL}/logos/logoMini.png`;

export const otherConfig: interfaces.IOtherConfig = {
  fakeLatency: Number(process.env.FAKE_LATENCY ?? "0"),
};

export const redisConfig: interfaces.IRedisConfig = {
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

export const smsConfig: interfaces.ISMSConfig = {
  provider: "onewaysms",
  username: process.env.ONEWAY_USERNAME || "",
  password: process.env.ONEWAY_PASSWORD || "",
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

export const panelConfig: interfaces.IPanelConfig = {
  panelURL,
  defaultPassword,
};

// //Note: this email needs to be verified for sending mail
// export const fromEmail = process.env.FROM_EMAIL || 'no-reply@max360.com';

const AppName = process.env.APP_NAME || "Boleh";

const development: interfaces.IConfig = {
  app: {
    isProduction: false,
    environment: "development",
    name: AppName,
    port,
    secretKey: process.env.SECRET_KEY as string,
    baseURL,
    logo,
    logoMini,
  },

  other: otherConfig,

  db: dbConfig,
  redis: redisConfig,

  aws: awsConfig,

  email: emailConfig,
  sms: smsConfig,

  panel: panelConfig,

  uploadUtil,
  emailUtil,
};

const production: interfaces.IConfig = {
  app: {
    isProduction: true,
    environment: "production",
    name: AppName,
    port,
    secretKey: process.env.SECRET_KEY as string,
    baseURL,
    logo,
    logoMini,
  },
  other: otherConfig,

  db: dbConfig,
  redis: redisConfig,

  aws: awsConfig,

  email: emailConfig,
  sms: smsConfig,

  panel: panelConfig,

  uploadUtil,
  emailUtil,
};

const config: Record<interfaces.IEnvEnvironment, interfaces.IConfig> = {
  development,
  production,
};

export default config[env];
