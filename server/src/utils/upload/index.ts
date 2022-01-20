import crypto from 'crypto';

import { nodeEnv, uploadUtil } from '../../config';
import { IUploadedFile } from '../../interfaces';

import * as s3 from './s3';
import * as local from './local';

const isS3Enabled = uploadUtil === 's3';

export const keyGenerator = (
  prefix: string,
  mimetype: string,
  file_prefix = ''
) => {
  let key = crypto.randomBytes(16).toString('hex');

  if (file_prefix) {
    key = `${file_prefix}_${key}`;
  }

  const extArr = mimetype.split('/');
  const extension = extArr[extArr.length - 1];

  return {
    extension,
    key: `${UploadFolder}/${nodeEnv}/${prefix}/${key}.${extension}`,
  };
};

export const uploadFile = isS3Enabled ? s3.uploadFile : local.uploadFile;
export const downloadFile = isS3Enabled ? s3.downloadFile : local.downloadFile;
export const deleteFile = isS3Enabled ? s3.deleteFile : local.deleteFile;
export const copyFile = isS3Enabled ? s3.copyFile : local.copyFile;

export const signedURL = isS3Enabled ? s3.signedURL : local.signedURL;
export const uploadBaseURL = isS3Enabled ? s3.s3BaseURL : local.localBaseURL;
export const UploadFolder = isS3Enabled ? s3.UploadFolder : local.UploadFolder;
// https://general-home-updated.s3.us-east-2.amazonaws.com/FieldMax360

export const newUploadFile = async (
  prefix: string,
  file: IUploadedFile,
  allowPublicAccess: boolean = false
) => {
  const { key } = keyGenerator(prefix, file.mimetype);

  const upload = await uploadFile({
    key,
    body: file.data,
    contentType: file.mimetype,
    allowPublicAccess,
  });

  return upload;
};
