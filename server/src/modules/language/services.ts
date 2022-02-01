import models from "@models/index";

import * as interfaces from "./interfaces";

export const languagesList = async () => {
  let languages = await models.Language.findAll({
    attributes: ["id", "name", "code"],
  });

  return languages;
};

export const languagesAdd = async (
  userId: number,
  data: interfaces.LanguagesAddParams
) => {
  await models.UserLang.destroy({
    where: { userId },
  });

  await models.UserLang.bulkCreate(
    data.languages.map((languageId) => {
      return {
        userId,
        languageId,
      };
    })
  );
};
