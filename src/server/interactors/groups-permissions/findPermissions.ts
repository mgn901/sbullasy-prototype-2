import { permissionToPermissionWithItemForMember } from '../../converters/permissionToPermissionWithItemForMember.ts';
import { IGroup } from '../../models/interfaces';
import { IPermissionWithItemForMember } from '../../schemas/IPermissionWithItemForMember.ts';
import { IInteractorOptions } from '../IInteractorOptions';
import { NotFoundError } from '../errors/NotFoundError';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow';

export const findPermissions = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
  }>,
): Promise<IPermissionWithItemForMember[]> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      groupId,
      requiresAdminUser: false,
    },
    tokenFromClient,
  );

  const group = await repository.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      permissions: {
        include: {
          targetType: true,
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }

  return group.permissions.map(permissionToPermissionWithItemForMember);
};
