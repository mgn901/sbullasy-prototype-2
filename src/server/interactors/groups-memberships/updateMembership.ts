import { IGroup, IMembership, IUser } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const updateMembership = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    userId: IUser['id'];
    type: IMembership['type'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { userId, groupId, type } = query;

  await checkTokenOrThrow(
    repository,
    {
      groupId,
      requiresAdminUser: true,
    },
    tokenFromClient,
  );

  await repository.group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        update: {
          where: {
            userId_groupId: { userId, groupId },
          },
          data: { type },
        },
      },
    },
  });
};
