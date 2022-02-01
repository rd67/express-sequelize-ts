import Address from "./addresses";

import User from "./users";

import Language from "./languages";

import UserTemp from "./userTemps";

import UserCode from "./userCodes";
import UserLang from "./userLangs";
import UserDevice from "./userDevices";

import Media from "./medias";

import Notification from "./notifications";

import Setting from "./settings";

import Chat from "./chats";
import ChatMessage from "./chatMessages";

import UserReferal from "./userReferals";

const models = {
  Address,

  Language,

  User,

  UserTemp,

  UserCode,
  UserLang,
  UserDevice,

  Media,

  Notification,

  Setting,

  Chat,
  ChatMessage,

  UserReferal,
};

export const associateModels = function () {
  //@ts-ignore
  Object.keys(models).forEach(function (modelName) {
    //@ts-ignore
    if ("associate" in models[modelName]) {
      // call the associate function and pass reference to all other models
      //@ts-ignore
      models[modelName].associate(models);
    }
  });
};

export default models;
