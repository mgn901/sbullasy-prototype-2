import { IItem, IPermission } from '../models/interfaces.ts';
import { IPermissionWithItemForMember } from '../schemas/IPermissionWithItemForMember.ts';
import { itemToItemSerializedForPublic } from './itemToItemSerializedForPublic.ts';

export const permissionToPermissionWithItemForMember = (
  permission: IPermission & {
    targetType: IItem;
  },
): IPermissionWithItemForMember => {
  const { id, type, expiresAt, targetType } = permission;
  return {
    id,
    type,
    expiresAt,
    targetType: itemToItemSerializedForPublic(targetType),
  };
};
