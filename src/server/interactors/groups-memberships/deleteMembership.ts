import { IGroup, IUser } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteMembership = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    userId: IUser['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, userId } = query;

  await (async () => {
    try {
      await checkTokenOrThrow(
        repository,
        {
          requiresVerifiedUser: true,
          groupId,
          requiresAdminUser: true,
        },
        tokenFromClient,
      );
    } catch (error) {
      if (!(error instanceof InvalidTokenError)) {
        throw error;
      }
      const token = await checkTokenOrThrow(
        repository,
        {
          requiresVerifiedUser: true,
        },
        tokenFromClient,
      );
      if (userId !== token.ownerId) {
        throw error;
      }
    }
  })();

  await repository.group.update({
    where: {
      id: groupId,
    },
    data: {
      members: {
        delete: {
          userId_groupId: { userId, groupId },
        },
      },
    },
  });
};
