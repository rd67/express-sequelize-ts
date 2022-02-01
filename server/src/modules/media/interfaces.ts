import { IMediaKind } from "@interfaces/medias";

export interface MediaAddParams {
  media: string;
  kind: IMediaKind;
}

export interface MediasListParams {
  kind: IMediaKind;
}

export interface MediaDeleteParams {
  kind: IMediaKind;
  mediaId: number;
}
