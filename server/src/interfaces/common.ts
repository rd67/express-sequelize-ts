import { Request } from "express";
import { UploadedFile } from "express-fileupload";

import { UserInstance } from "@models/users";

export type IUploadedFile = UploadedFile;

export enum IDeviceTypes {
  web = "WEB",
  android = "ANDROID",
  ios = "IOS",
}

export enum ISenderReceiverType {
  user = "User",
  admin = "Admin",
  subAdmin = "SubAdmin",
}

export type ExpressUserReq = Request & {
  reqId: string;

  authToken: string;

  user: UserInstance;
};

// https://sequelize.org/master/class/lib/data-types.js~GEOMETRY.html
export type IPointType = {
  type: "Point";
  coordinates: [number, number];
  crs: { type: "name"; properties: { name: "EPSG:4326" } };
};

export interface CommonListParams {
  limit: number;
  offset: number;

  search?: string;

  startDt?: string;
  endDt?: string;
}
