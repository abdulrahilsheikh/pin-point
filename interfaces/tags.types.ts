export interface ITag {
  id: number;
  name: string;
  color: string;
}
export type ITagWithoutId = Omit<ITag, "id">;
export type ITagOptionalId = Omit<ITag, "id"> & { id?: number };
