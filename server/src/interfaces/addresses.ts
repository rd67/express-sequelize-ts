import { IPointType } from "./common";

export enum IAddressKind {
  home = "Home",
  locality = "Locality",
}

export interface InputAddress {
  formatted: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface AddressAttributes {
  id: number;

  userId: number;

  kind: IAddressKind;

  formatted: string;

  line1: string;

  line2: string | null;

  city: string | null;

  state: string | null;

  zipCode: string | null;

  country: string | null;

  point: IPointType;

  createdAt: Date;
  updatedAt: Date;
}
