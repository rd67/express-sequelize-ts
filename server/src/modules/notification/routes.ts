import express from "express";

import { IUserType } from "@interfaces/users";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

router.route("/admin/notification").get(
  AuthHandler({
    userTypeRequired: IUserType.admin | IUserType.subAdmin,
  }),
  ValidationHandler(validators.adminNotificationList),
  controllers.adminNotificationList
);

export default router;
