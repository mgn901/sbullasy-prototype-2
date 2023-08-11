import { IGroup, IItem } from '../models/interfaces.ts';
import { IItemWithOwner } from '../schemas/IItemWithOwner.ts';
import { groupToGroupSerializedForPublic } from './groupToGroupSerializedForPublic.ts';

export const itemToItemWithOwner = (item: IItem & { owner: IGroup | null }): IItemWithOwner => {
  const { id, name, createdAt, updatedAt, owner, isPublic } = item;
  return {
    id,
    name,
    createdAt,
    updatedAt,
    owner: owner ? groupToGroupSerializedForPublic(owner) : undefined,
    isPublic,
  };
};
