import express from "express";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import { IUserType } from "@interfaces/users";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

router.route("/settings").get(controllers.settings);

router.get(
  "/decodeJWT/:token",
  ValidationHandler(validators.decodeJWTToken),
  controllers.decodeJWTToken
);

router.post(
  "/testNotification",
  AuthHandler({}),
  ValidationHandler(validators.testNotification),
  controllers.testNotification
);

router.post(
  "/preSignedURLs",
  AuthHandler({
    userTypeRequired: IUserType.admin | IUserType.subAdmin,
  }),
  ValidationHandler(validators.preSignedURLs),
  controllers.preSignedURLs
);

export default router;
