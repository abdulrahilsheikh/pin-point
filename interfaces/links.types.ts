import { ITag } from "./tags.types";

export interface ILink {
  id: number;
  url: string;
  title: string;
  description: string;
  preview_image_url: string;
  favorite: number;
  created_at: string;
  updated_at: string;
}
export interface ILInkWithTags extends ILink {
  tags: ITag[];
}
