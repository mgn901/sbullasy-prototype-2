import { IUser } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteUser = async (
  options: IInteractorOptions<{
    userId: IUser['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  const { count } = await repository.user.deleteMany({
    where: {
      id: query.userId,
    },
  });

  if (count === 0) {
    throw new NotFoundError('The user you specified is not found.');
  }
};
