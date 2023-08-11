import { IGroup } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteGroup = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId } = query;

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

    const { count } = await repository.group.deleteMany({
      where: { id: groupId },
    });

    if (count === 0) {
      throw new NotFoundError('The group you specified is not found.');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    await checkTokenOrThrow(
      repository,
      {
        requiresAdminGroup: true,
      },
      tokenFromClient,
    );

    const { count } = await repository.group.deleteMany({
      where: { id: groupId },
    });

    if (count === 0) {
      throw new NotFoundError('The group you specified is not found.');
    }
  }
};
