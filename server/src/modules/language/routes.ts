import express from "express";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

router
  .route("/")
  .get(controllers.languagesList)
  .post(
    AuthHandler({}),
    ValidationHandler(validators.languagesAdd),
    controllers.languagesAdd
  );

export default router;
