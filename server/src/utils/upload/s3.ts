import S3Package from "aws-sdk/clients/s3";
import fs, { promises as fsPromise } from "fs";

import { awsConfig } from "@config/config";

import * as interfaces from "./interfaces";

const S3 = new S3Package({
  accessKeyId: awsConfig.accessId,
  secretAccessKey: awsConfig.secretKey,
  signatureVersion: "v4",
  region: awsConfig.region,
});

const { s3Bucket } = awsConfig;

export const uploadFile = async ({
  key,
  body,
  contentType,
  allowPublicAccess,
}: interfaces.Upload) => {
  await S3.putObject({
    Key: key,
    Body: body,
    Bucket: awsConfig.s3Bucket,
    ContentType: contentType,
    ACL: allowPublicAccess ? "public-read" : undefined,
  }).promise();

  return key;
};

export const deleteFile = async ({ key }: interfaces.Key) => {
  await S3.deleteObject({
    Key: key,
    Bucket: s3Bucket,
  }).promise();

  return true;
};

export const downloadFile = async ({ key, dest }: interfaces.Download) => {
  // Creating Dir
  let destArray = dest.split("/");
  destArray.splice(destArray.length - 1);
  let folder = destArray.join("/");

  await fsPromise.mkdir(folder, { recursive: true });

  const fsStream = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    S3.getObject({
      Key: key,
      Bucket: s3Bucket,
    })
      .createReadStream()
      .pipe(fsStream);

    fsStream.on("close", () => {
      return resolve(dest);
    });
    fsStream.on("error", reject);
  });
};

export const signedURL = (key: string) => {
  return S3.getSignedUrlPromise("getObject", {
    Key: key,
    Bucket: s3Bucket,
    Expires: 60 * 60 * 8, //8 Hrs Expiration
  });
};

export const s3BaseURL = () => {
  return `https://${s3Bucket}.s3.${awsConfig.region}.amazonaws.com`;
  // return `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com`;
  // https://{s3Bucket}.s3.us-east-2.amazonaws.com
};

export const preSignedURL = async (key: string) => {
  const url = await S3.getSignedUrlPromise("putObject", {
    Key: key,
    Bucket: s3Bucket,
    Expires: 10 * 60, // 10 minutes Expiration
  });

  return {
    url,
    key,
  };
};

export const copyFile = async (source: string, dest: string) => {
  await S3.copyObject({
    Bucket: s3Bucket,
    CopySource: `${s3Bucket}/${source}`,
    Key: dest,
  }).promise();

  return dest;
};
