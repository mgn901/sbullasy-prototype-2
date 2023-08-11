import { permissionToPermissionWithItemForMember } from '../../converters/permissionToPermissionWithItemForMember.ts';
import { IGroup, IPermission } from '../../models/interfaces.ts';
import { IPermissionForPayload } from '../../schemas/IPermissionForPayload.ts';
import { IPermissionWithItemForMember } from '../../schemas/IPermissionWithItemForMember.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';

export const createPermission = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    value: IPermissionForPayload;
  }>,
): Promise<IPermissionWithItemForMember> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, value: permission } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  const permissionId = generateId();
  const permissionWithId: IPermission = {
    ...permission,
    id: permissionId,
    grantsToId: groupId,
  };

  const group = await repository.group.update({
    where: { id: groupId },
    data: permissionWithId,
    select: {
      permissions: {
        where: {
          id: permissionId,
        },
        include: {
          targetType: true,
        },
      },
    },
  });

  return permissionToPermissionWithItemForMember(group.permissions[0]);
};
