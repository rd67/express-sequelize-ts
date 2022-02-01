import { Dialect } from "sequelize";
//DB_DRIVER as Dialect

export type IEnvEnvironment = "production" | "development";

export type IUploadUtilType = "s3" | "local";

export type IEmailUtilType = "ses";

interface IAppConfig {
  isProduction: boolean;
  environment: IEnvEnvironment;
  name: string;
  port: number;
  secretKey: string;
  baseURL: string;
  logo: string;
  logoMini: string;
}

export interface IOtherConfig {
  fakeLatency: number;
}

export interface IRedisConfig {
  url: string;
  rateLimit: number;
}

export interface IAwsConfig {
  accessId: string;
  secretKey: string;
  s3Bucket: string;
  region: string;
}

export interface IEmailConfig {
  provider: "ses";
  fromEmail: string;
}

export interface ISMSConfig {
  provider: "sns" | "onewaysms";
  username: string;
  password: string;
}

export interface IDbConfig {
  host: string;
  database: string;
  username: string;
  password: string;
  port: number;
  dialect: Dialect;
  pool: {
    min: number;
    max: number;
  };
  // logging: boolean;
  // force: boolean;
}

export interface IPanelConfig {
  panelURL: string;
  defaultPassword: string;
}

export interface IConfig {
  app: IAppConfig;

  other: IOtherConfig;

  db: IDbConfig;
  redis: IRedisConfig;

  aws: IAwsConfig;

  email: IEmailConfig;
  sms: ISMSConfig;

  panel: IPanelConfig;

  uploadUtil: IUploadUtilType;

  emailUtil: IEmailUtilType;
}
