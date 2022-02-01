export interface IAppVersioning {
  ios: {
    force: string;
    optional: string;
  };
  android: {
    force: string;
    optional: string;
  };
}

export interface SettingAttributes {
  id: number;

  versioning: IAppVersioning;

  createdAt: Date;
  updatedAt: Date;
}
