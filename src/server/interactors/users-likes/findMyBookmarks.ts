import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { itemToItemWithOwner } from '../../converters/itemToItemWithOwner.ts';
import { IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IItemWithOwner } from '../../schemas/IItemWithOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { convertQueryToPrismaSelectSubset } from '../utils/convertQueryToPrismaSelectSubset.ts';

export const findBookmarks = async (
  options: IInteractorOptions<
    { typeId: IItem['typeId'] } & IInteractorQuery<['updatedAt', 'desc']>
  >,
): Promise<(IItemWithOwner & IItemWithAttributes)[]> => {
  const { repository, query, tokenFromClient } = options;
  const { typeId } = query;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const user = await repository.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      bookmarks: {
        where: {
          item: {
            typeId,
            isPublic: true,
          },
        },
        include: {
          item: {
            include: {
              owner: true,
              type: {
                include: {
                  attributes: true,
                },
              },
              attributes: {
                include: {
                  valueItem: true,
                },
              },
            },
          },
        },
        ...convertQueryToPrismaSelectSubset(query),
        cursor: query.cursor ? { userId_itemId: { userId, itemId: query.cursor } } : undefined,
      },
    },
  });

  if (!user) {
    throw new NotFoundError('The user is not found.');
  }

  return user.bookmarks.map((bookmark) => ({
    ...itemToItemWithOwner(bookmark.item),
    ...itemToItemWithAttributes({ item: bookmark.item, forSummary: true }),
  }));
};
