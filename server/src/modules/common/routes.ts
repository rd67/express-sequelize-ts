import express from "express";

// import { validate } from '../../utils/joi';
// import { isAuthenticatedCheck } from '../../helpers/middlewares';

import * as controllers from "./controllers";
// import * as validators from './validators';

const router = express.Router();

router.route("/appVersioning").get(controllers.getAppVersioning);

export default router;
