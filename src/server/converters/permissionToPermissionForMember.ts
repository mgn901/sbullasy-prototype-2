import { IGroup, IItem, IPermission } from '../models/interfaces.ts';
import { IPermissionWithGroupForMember } from '../schemas/IPermissionWithGroupForMember.ts';
import { IPermissionWithItemForMember } from '../schemas/IPermissionWithItemForMember.ts';
import { groupToGroupSerializedForPublic } from './groupToGroupSerializedForPublic.ts';
import { itemToItemSerializedForPublic } from './itemToItemSerializedForPublic.ts';

export const permissionToPermissionForMember = (
  permission: IPermission & {
    grantsTo: IGroup;
    targetType: IItem;
  },
): IPermissionWithGroupForMember & IPermissionWithItemForMember => {
  const { id, type, expiresAt, grantsTo, targetType } = permission;
  return {
    id,
    type,
    expiresAt,
    grantsTo: groupToGroupSerializedForPublic(grantsTo),
    targetType: itemToItemSerializedForPublic(targetType),
  };
};
