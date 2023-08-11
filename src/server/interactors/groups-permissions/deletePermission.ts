import { IGroup, IPermission } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deletePermission = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    permissionId: IPermission['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, permissionId } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  await repository.group.update({
    where: {
      id: groupId,
    },
    data: {
      permissions: {
        delete: {
          id: permissionId,
        },
      },
    },
  });
};
