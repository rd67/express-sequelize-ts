import SettingModel from "@models/settings";

export const appVersioning = async () => {
  let settings = await SettingModel.findOne();

  return {
    versioning: settings?.versioning,
  };
};
