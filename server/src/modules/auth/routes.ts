import express from "express";

import { ValidationHandler } from "@middlewares/validation";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

router
  .route("/unique")
  .post(ValidationHandler(validators.unique), controllers.unique);

//  Signup Steps
router
  .route("/signup")
  .post(ValidationHandler(validators.signup), controllers.signup);
router
  .route("/signup/otp")
  .post(ValidationHandler(validators.signupOTP), controllers.signupOTP);

//  Login Steps
router
  .route("/login")
  .post(ValidationHandler(validators.login), controllers.login);
router
  .route("/login/otp")
  .post(ValidationHandler(validators.loginOTP), controllers.loginOTP);

//  Phone Change Steps
router
  .route("/phoneChange")
  .put(ValidationHandler(validators.phoneChange), controllers.phoneChange);
router
  .route("/phoneChange/new")
  .put(
    ValidationHandler(validators.phoneChangeNew),
    controllers.phoneChangeNew
  );
router
  .route("/phoneChange/otp")
  .put(
    ValidationHandler(validators.phoneChangeOTP),
    controllers.phoneChangeOTP
  );

//  Pin Reset Steps
router
  .route("/pinReset")
  .put(ValidationHandler(validators.pinReset), controllers.pinReset);
router
  .route("/pinReset/otp")
  .put(ValidationHandler(validators.pinResetOTP), controllers.pinResetOTP);

router.post("/logout", controllers.logout);

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

router
  .route("/admin/login")
  .post(ValidationHandler(validators.adminLogin), controllers.adminLogin);

router.post(
  "/admin/passwordForgot",
  ValidationHandler(validators.adminPasswordForgot),
  controllers.adminPasswordForgot
);
router.post(
  "/admin/passwordReset",
  ValidationHandler(validators.adminPasswordReset),
  controllers.adminPasswordReset
);

export default router;
