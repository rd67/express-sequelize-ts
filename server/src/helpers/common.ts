import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";

import config from "@config/config";

import { IPointType } from "@interfaces/common";

import { logger } from "@utils/logger";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const uuidGenerate = () => {
  return uuidv4();
};

export const generateReferalCode = (length = 15) => {
  return nanoid(length);
};

export const pick = (object: Object, keys: string[]): object => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      //@ts-ignore
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export const capitalizeFirstLetter = (value: string): string => {
  return value[0].toUpperCase() + value.slice(1);
};

export const capitalizeFirstLetters = (str: string) => {
  return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
};

export const generateOTP = (len = 6) => {
  //  If Not Production then always sending same OTP
  if (!config.app.isProduction) {
    return 123456;
  }

  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return Number(OTP);
};

export const convertToPoint = (
  latitude: number,
  longitude: number
): IPointType => {
  return {
    type: "Point",
    coordinates: [longitude, latitude], // GeoJson format: [lng, lat]
    crs: { type: "name", properties: { name: "EPSG:4326" } },
  };
};

export const logInfo = (data: any) => {
  logger.info(JSON.stringify(data, null, 2));
};

export const logError = (data: any) => {
  logger.info(JSON.stringify(data, null, 2));
};

export const roundNumber = (num: number, decimalPlaces = 2) => {
  //@ts-ignore
  return +(Math.round(num + "e+" + decimalPlaces) + "e-" + decimalPlaces);
};
