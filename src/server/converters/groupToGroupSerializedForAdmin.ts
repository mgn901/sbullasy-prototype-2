import { IGroup } from '../models/interfaces.ts';
import { IGroupSerializedForAdmin } from '../schemas/IGroupSerializedForAdmin.ts';

export const groupToGroupSerializedForAdmin = (group: IGroup): IGroupSerializedForAdmin => {
  const { id, name, displayName, createdAt, isAdmin, invitationCode } = group;
  return { id, name, displayName, createdAt, isAdmin, invitationCode };
};
