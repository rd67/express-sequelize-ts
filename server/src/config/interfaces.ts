import { Dialect } from "sequelize";
//DB_DRIVER as Dialect

export type IEnvEnvironment = "production" | "development";

interface IAppConfig {
  isProduction: boolean;
  environment: IEnvEnvironment;
  port: number;
  secretKey: string;
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

export interface IConfig {
  app: IAppConfig;
  other: IOtherConfig;
  db: IDbConfig;
  redis: IRedisConfig;
  aws: IAwsConfig;
  email: IEmailConfig;
}
