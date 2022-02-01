export enum IMediaKind {
  portfolio = "Portfolio",
}

export interface MediaAttributes {
  id: number;

  userId: number;

  media: string;

  kind: IMediaKind;

  createdAt: Date;
  updatedAt: Date;
}
