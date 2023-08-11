import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IGroup, IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findItem = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    typeId: NonNullable<IItem['typeId']>;
    itemId: IItem['id'];
  }>,
): Promise<IItemWithAttributes> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, typeId, itemId } = query;

  const onlyIsPublic = await (async () => {
    try {
      await checkTokenOrThrow(
        repository,
        {
          requiresVerifiedUser: true,
          groupId,
          requiresAdminUser: false,
        },
        tokenFromClient,
      );
      return false;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return true;
      }
      throw error;
    }
  })();

  const group = await repository.group.findUnique({
    where: { id: groupId },
    include: {
      items: {
        where: {
          id: itemId,
          typeId,
          isPublic: onlyIsPublic ? true : undefined,
        },
        include: {
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
  });

  if (!group || group.items.length === 0) {
    throw new NotFoundError('The group you specified is not found.');
  }
  const item = group.items[0];

  if (onlyIsPublic && !item.isPublic) {
    throw new NotFoundError('The item you specified is not found.');
  }

  return itemToItemWithAttributes({ item, forSummary: false });
};
