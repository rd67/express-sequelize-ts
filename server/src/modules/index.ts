import { Application } from "express";

import { default as v1Common } from "./common/routes";

import { default as v1Auth } from "./auth/routes";

const API_V1_PERFIX = "/api/v1";

export default (app: Application) => {
  app.use(`${API_V1_PERFIX}/common`, v1Common);

  app.use(`${API_V1_PERFIX}/auth`, v1Auth);
};
