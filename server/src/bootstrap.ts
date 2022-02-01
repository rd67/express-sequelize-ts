import chalk from "chalk";

import { panelConfig } from "@config/config";

import { IUserType } from "@interfaces/users";

import { hashString } from "@utils/bcrypt";

import { generateReferalCode } from "@helpers/common";

import models from "@models/index";

import { DEFAULT_LANGUAGE } from "@modules/language/constants";

export const bootstrapApp = async () => {
  //  Default Language Create
  const languageCheck = await models.Language.count();
  if (!languageCheck) {
    await models.Language.create({
      ...DEFAULT_LANGUAGE,
    });
  }

  //  Default User, UserTemp Create
  let userCount = await models.User.count();
  if (!userCount) {
    const pin = await hashString(panelConfig.defaultPassword);

    await Promise.all([
      models.User.create({
        userType: IUserType.user | IUserType.admin | IUserType.subAdmin,
        name: "Admin",
        phoneCode: "",
        phone: "",
        email: "admin@boleh.app",
        pin,
        referalCode: generateReferalCode(),
      }),
      models.UserTemp.create({
        name: "Admin",
        phoneCode: "",
        phone: "",
        pin: "",
      }),
    ]);
  }

  console.log(`${chalk.cyan("🌿App Bootstrapped")} successfully.`);
};
