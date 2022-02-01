import express from "express";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

router
  .route("/")
  .post(
    AuthHandler({}),
    ValidationHandler(validators.mediaAdd),
    controllers.mediaAdd
  )
  .get(
    AuthHandler({}),
    ValidationHandler(validators.mediasList),
    controllers.mediasList
  )
  .delete(
    AuthHandler({}),
    ValidationHandler(validators.mediaDelete),
    controllers.mediaDelete
  );

export default router;
