export enum ICodeType {
  register = "Register",
  login = "Login",
  pinReset = "PinReset",
  phoneChange = "PhoneChange",

  phoneUpdate = "PhoneUpdate",
  emailUpdate = "EmailUpdate",
  pinUpdate = "PinUpdate",
}

export interface UserCodeAttributes {
  id: number;

  userId: number;

  userTempId: number | null;

  phoneCode: string;
  phone: string;

  email: string;

  code: number;

  codeType: ICodeType;

  expiresAt: Date | string;

  createdAt: Date;
  updatedAt: Date;
}
