import { userToUserSerializedForOwner } from '../../converters/userToUserSerializedForOwner.ts';
import { IUserSerializedForOwner } from '../../schemas/IUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findUser = async (
  options: IInteractorOptions<{ id: string }>,
): Promise<IUserSerializedForOwner> => {
  const { repository, query, tokenFromClient } = options;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  const user = await repository.user.findUnique({
    where: {
      id: query.id,
    },
  });

  if (!user) {
    throw new NotFoundError('The user you specified is not found.');
  }

  return userToUserSerializedForOwner(user);
};
