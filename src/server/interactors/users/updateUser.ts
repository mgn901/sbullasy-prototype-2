import { IUser } from '../../models/interfaces.ts';
import { IUserForPayload } from '../../schemas/IUserForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const updateUser = async (
  options: IInteractorOptions<{
    userId: IUser['id'];
    value: IUserForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { userId, value } = query;
  const { email, name, displayName } = value;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  await repository.user.update({
    where: {
      id: userId,
    },
    data: { email, name, displayName },
  });
};
