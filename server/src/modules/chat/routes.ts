import express from "express";

import { IUserType } from "@interfaces/users";

import { AuthHandler, ValidationHandler } from "@middlewares/index";

import * as controllers from "./controllers";
import * as validators from "./validators";

const router = express.Router();

//////////////////////////
//  //  //  Chat
//////////////////////////

router
  .route("/chat")
  .post(
    AuthHandler({}),
    ValidationHandler(validators.chatAdd),
    controllers.chatAdd
  )
  .get(
    AuthHandler({}),
    ValidationHandler(validators.chatsHomeList),
    controllers.chatsHomeList
  );

router
  .route("/chat/:chatId")
  .get(
    AuthHandler({}),
    ValidationHandler(validators.chatMessagesList),
    controllers.chatMessagesList
  );

//////////////////////////
//  //  //  Support
//////////////////////////

router
  .route("/support")
  .post(
    AuthHandler({}),
    ValidationHandler(validators.supportAdd),
    controllers.supportAdd
  )
  .get(
    AuthHandler({}),
    ValidationHandler(validators.supportHomeList),
    controllers.supportHomeList
  );

router
  .route("/support/:supportId")
  .get(
    AuthHandler({}),
    ValidationHandler(validators.supportMessagesList),
    controllers.supportMessagesList
  )
  .put(
    AuthHandler({}),
    ValidationHandler(validators.supportChatUpdate),
    controllers.supportChatUpdate
  );

/////////////////////////////////////
//  Admin Apis
/////////////////////////////////////

router.route("/admin/support").get(
  AuthHandler({
    userTypeRequired: IUserType.admin | IUserType.subAdmin,
  }),
  ValidationHandler(validators.adminSupportHomeList),
  controllers.adminSupportHomeList
);

router
  .route("/admin/support/:supportId")
  .get(
    AuthHandler({
      userTypeRequired: IUserType.admin | IUserType.subAdmin,
    }),
    ValidationHandler(validators.adminSupportChatList),
    controllers.adminSupportChatList
  )
  .post(
    AuthHandler({
      userTypeRequired: IUserType.admin | IUserType.subAdmin,
    }),
    ValidationHandler(validators.adminSupportAdd),
    controllers.adminSupportAdd
  );

export default router;
