import express from "express";

import { IUserType } from "@interfaces/users";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

router
  .route("/")
  .get(AuthHandler({}), controllers.userProfile)
  .put(
    AuthHandler({}),
    ValidationHandler(validators.profileUpdate),
    controllers.profileUpdate
  );

router
  .route("/:oUserId(\\d+)")
  .get(
    AuthHandler({}),
    ValidationHandler(validators.oUserProfile),
    controllers.oUserProfile
  );

router
  .route("/language/:languageId")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.languageUpdate),
    controllers.languageUpdate
  );

router
  .route("/address")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.addressUpdate),
    controllers.addressUpdate
  );

//  Phone Change Steps
router
  .route("/phoneUpdate")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.phoneUpdate),
    controllers.phoneUpdate
  );
router
  .route("/phoneUpdate/otp")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.phoneUpdateOTP),
    controllers.phoneUpdateOTP
  );

//  Email Change Steps
router
  .route("/emailUpdate")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.emailUpdate),
    controllers.emailUpdate
  );
router
  .route("/emailUpdate/otp")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.emailUpdateOTP),
    controllers.emailUpdateOTP
  );

//  Pin Change Steps
router
  .route("/pinUpdate")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.pinUpdate),
    controllers.pinUpdate
  );
router
  .route("/pinUpdate/otp")
  .put(
    AuthHandler({}),
    ValidationHandler(validators.pinUpdateOTP),
    controllers.pinUpdateOTP
  );

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

router.route("/admin/list").get(
  AuthHandler({
    userTypeRequired: IUserType.admin | IUserType.subAdmin,
  }),
  ValidationHandler(validators.adminUsersList),
  controllers.adminUsersList
);

export default router;
