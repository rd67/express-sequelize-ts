import jwt from "jsonwebtoken";

import config from "@config/config";

export const jwtPackage = jwt;

export const encodeJWT = (
  data: any,
  options: jwt.SignOptions = {
    expiresIn: 60 * 60 * 12,
  }
): string => jwt.sign(data, config.app.secretKey, options);

export const decodeJWT = (token: string, options?: jwt.VerifyOptions) =>
  jwt.verify(token, config.app.secretKey, options);
