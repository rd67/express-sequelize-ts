export enum IUserType {
  user = 1 << 0,

  admin = 1 << 1,
  subAdmin = 1 << 2,
}

export interface UserAttributes {
  id: number;

  userType: number;

  name: string;

  email: string;

  phoneCode: string;
  phone: string;

  languageId: number;

  pin: string;

  profilePic: string;
  coverPic: string;

  dob: Date | null;

  description?: string | null;

  isBlocked: boolean;

  lastSeen: Date;

  referalCode: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
