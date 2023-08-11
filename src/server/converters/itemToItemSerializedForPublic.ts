import { IItem } from '../models/interfaces.ts';
import { IItemSerializedForPublic } from '../schemas/IItemSerializedForPublic.ts';

export const itemToItemSerializedForPublic = (item: IItem): IItemSerializedForPublic => {
  const { id, name, createdAt, updatedAt, isPublic } = item;
  return { id, name, createdAt, updatedAt, isPublic };
};
