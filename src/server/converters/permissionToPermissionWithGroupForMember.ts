import { IGroup, IItem, IPermission } from '../models/interfaces.ts';
import { IPermissionWithGroupForMember } from '../schemas/IPermissionWithGroupForMember.ts';
import { groupToGroupSerializedForPublic } from './groupToGroupSerializedForPublic.ts';

export const permissionToPermissionWithGroupForMember = (
  permission: IPermission & {
    grantsTo: IGroup;
    targetType: IItem;
  },
): IPermissionWithGroupForMember => {
  const { id, type, expiresAt, grantsTo } = permission;
  return {
    id,
    type,
    expiresAt,
    grantsTo: groupToGroupSerializedForPublic(grantsTo),
  };
};
