import { IGroup, IItem, IPermission, IToken } from '../models/interfaces.ts';
import { ITokenSerializedForOwner } from '../schemas/ITokenSerializedForOwner.ts';
import { permissionToPermissionForMember } from './permissionToPermissionForMember.ts';

export const tokenToTokenSerializedForOwner = (
  token: IToken & {
    permission:
      | (IPermission & {
          grantsTo: IGroup;
          targetType: IItem;
        })
      | null;
  },
): ITokenSerializedForOwner => {
  const { id, secret, type, expiresAt, permission } = token;
  const permissionSerialized = permission ? permissionToPermissionForMember(permission) : undefined;
  return { id, secret, type, expiresAt, permission: permissionSerialized };
};
