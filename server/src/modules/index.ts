import { Application } from "express";

import { default as v1Common } from "./common/routes";

import { default as v1Auth } from "./auth/routes";

import { default as v1Language } from "./language/routes";

import { default as v1Media } from "./media/routes";

import { default as v1User } from "./user/routes";

import { default as v1Chat } from "./chat/routes";

import { default as v1Notification } from "./notification/routes";

const API_V1_PERFIX = "/api/v1";

export default (app: Application) => {
  app.use(`${API_V1_PERFIX}/common`, v1Common);

  app.use(`${API_V1_PERFIX}/auth`, v1Auth);

  app.use(`${API_V1_PERFIX}/languages`, v1Language);

  app.use(`${API_V1_PERFIX}/media`, v1Media);

  app.use(`${API_V1_PERFIX}/user`, v1User);

  app.use(`${API_V1_PERFIX}`, v1Chat);

  app.use(`${API_V1_PERFIX}`, v1Notification);
};
