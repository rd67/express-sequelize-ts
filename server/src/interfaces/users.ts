export interface UserAttributes {
  id: number;

  name: string;

  email: string;

  countryCode: string;
  phone: string;

  passport: string;

  pin: string;

  profilePic?: string | null;
  coverPic?: string | null;

  dob: Date | null;

  description?: string | null;
  tagline?: string | null;

  isUserBlocked: boolean;
  isSolverBlocked: boolean;

  lastSeen: Date;
  // password?: string | null;
  // preferredName: string | null;
}
