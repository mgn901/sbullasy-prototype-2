import { userToUserSerializedForOwner } from '../../converters/userToUserSerializedForOwner.ts';
import { IUserSerializedForOwner } from '../../schemas/IUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findMe = async (options: IInteractorOptions<{}>): Promise<IUserSerializedForOwner> => {
  const { repository, tokenFromClient } = options;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const user = await repository.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError('The user you specified is not found.');
  }

  return userToUserSerializedForOwner(user);
};
