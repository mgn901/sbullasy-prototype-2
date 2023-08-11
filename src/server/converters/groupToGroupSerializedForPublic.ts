import { IGroup } from '../models/interfaces.ts';
import { IGroupSerializedForPublic } from '../schemas/IGroupSerializedForPublic.ts';

export const groupToGroupSerializedForPublic = (group: IGroup): IGroupSerializedForPublic => {
  const { id, name, displayName, createdAt, isAdmin } = group;
  return { id, name, displayName, createdAt, isAdmin };
};
