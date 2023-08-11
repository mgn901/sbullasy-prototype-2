import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteMe = async (options: IInteractorOptions<{}>): Promise<void> => {
  const { repository, tokenFromClient } = options;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );

  const { count } = await repository.user.deleteMany({
    where: {
      id: token.ownerId,
    },
  });

  if (count === 0) {
    throw new NotFoundError('The user you specified is not found.');
  }
};
