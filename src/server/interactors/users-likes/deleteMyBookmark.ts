import { IItem } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteBookmark = async (
  options: IInteractorOptions<{
    typeId: IItem['typeId'];
    itemId: IItem['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { itemId } = query;

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
    data: {
      bookmarks: {
        delete: {
          userId_itemId: { userId, itemId },
        },
      },
    },
  });
};
