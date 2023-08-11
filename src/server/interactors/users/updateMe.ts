import { IUserForPayload } from '../../schemas/IUserForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const updateMe = async (
  options: IInteractorOptions<{
    value: IUserForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { value } = query;
  const { email, name, displayName } = value;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  await repository.user.update({
    where: {
      id: userId,
    },
    data: { email, name, displayName },
  });
};
