export interface Upload {
  key: string;
  body: Buffer;
  contentType: string;
  allowPublicAccess?: boolean;
}

export interface Key {
  key: string;
}

export interface Download {
  key: string;
  dest: string;
}
