import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { itemToItemWithOwner } from '../../converters/itemToItemWithOwner.ts';
import { IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IItemWithOwner } from '../../schemas/IItemWithOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findItem = async (
  options: IInteractorOptions<{
    typeId: IItem['typeId'];
    itemId: IItem['id'];
  }>,
): Promise<IItemWithOwner & IItemWithAttributes> => {
  const { repository, query, tokenFromClient } = options;
  const { typeId, itemId } = query;

  const item = await repository.item.findUnique({
    where: {
      id: itemId,
      typeId,
    },
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
  });

  if (!item) {
    throw new NotFoundError('The item you specified is not found.');
  }

  if (!item.isPublic) {
    if (!item.ownerId) {
      throw new NotFoundError('The item you specified is not found.');
    }
    try {
      await checkTokenOrThrow(
        repository,
        {
          requiresVerifiedUser: true,
          groupId: item.ownerId,
          requiresAdminUser: false,
        },
        tokenFromClient,
      );
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new NotFoundError('The item you specified is not found.');
      }
      throw error;
    }
  }

  return {
    ...itemToItemWithOwner(item),
    ...itemToItemWithAttributes({ item, forSummary: false }),
  };
};
