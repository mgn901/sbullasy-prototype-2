import { IToken } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteMyToken = async (
  options: IInteractorOptions<{
    tokenId: IToken['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
      requiresAdminUser: false,
      requiresAdminGroup: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  await repository.user.update({
    where: { id: userId },
    data: {
      tokens: {
        delete: {
          id: query.tokenId,
        },
      },
    },
  });
};
