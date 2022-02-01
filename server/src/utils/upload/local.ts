import fs, { promises as fsPromise } from "fs";
import * as http from "http";
import * as https from "https";
import * as util from "util";

import config from "@config/config";

import { logger } from "@utils/logger";

import * as interfaces from "./interfaces";

const OuterFolderName = "public";

export const UploadFolder = "uploads";

export const uploadFile = async ({ key, body }: interfaces.Upload) => {
  let { folder, fileName } = await makeDir(key);

  await fsPromise.writeFile(`${folder}/${fileName}`, body, "binary");

  return key;
};

export const deleteFile = async ({ key }: interfaces.Key) => {
  let keyArray = key.split("/");
  if (keyArray[0] !== OuterFolderName) {
    key = `${OuterFolderName}/${key}`;
  }

  logger.info(`Unlinking ${key}`);

  await fsPromise.unlink(key);

  return true;
};

export const downloadFile = async ({ key, dest }: interfaces.Download) => {
  await makeDir(dest);

  const fsStream = fs.createWriteStream(dest);

  const proto = !key.charAt(4).localeCompare("s") ? https : http;

  return new Promise((resolve, reject) => {
    const request = proto.get(key, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(dest);
        reject(new Error(`Failed to get '${key}' (${response.statusCode})`));
        return;
      }

      response.pipe(fsStream);
    });

    // The destination stream is ended by the time it's called
    fsStream.on("finish", () => resolve(key));
    request.on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });
    fsStream.on("error", (err) => {
      fs.unlink(dest, () => reject(err));
    });

    request.end();
  });
};

export const signedURL = (key: string) => {
  return `${config.app.baseURL}/${key}`;
};

export const localBaseURL = () => {
  return `${config.app.baseURL}/public/${UploadFolder}`;
};

export const copyFile = async (source: string, target: string) => {
  await makeDir(target);

  await util.promisify(fs.copyFile)(
    `${OuterFolderName}/${source}`,
    `${OuterFolderName}/${target}`
  );
};

export const makeDir = async (key: string) => {
  let keyArray = key.split("/");
  let fileName = keyArray[keyArray.length - 1];
  keyArray.splice(keyArray.length - 1);

  let folder = keyArray.join("/");

  if (keyArray[0] !== OuterFolderName) {
    folder = `${OuterFolderName}/${folder}`;
  }

  await fsPromise.mkdir(folder, { recursive: true });

  return {
    folder,
    fileName,
  };
};
