import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IGroup, IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { convertQueryToPrismaSelectSubset } from '../utils/convertQueryToPrismaSelectSubset.ts';

export const findItems = async (
  options: IInteractorOptions<
    {
      groupId: IGroup['id'];
      typeId: NonNullable<IItem['typeId']>;
    } & IInteractorQuery
  >,
): Promise<IItemWithAttributes[]> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, typeId } = query;

  const clientIsMember = await (async () => {
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
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return false;
      }
      throw error;
    }
  })();

  const group = await repository.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      items: {
        where: {
          typeId,
          isPublic: clientIsMember ? undefined : true,
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
        ...convertQueryToPrismaSelectSubset(query),
      },
    },
  });

  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }

  const itemsSerialized: IItemWithAttributes[] = group.items.map((item) =>
    itemToItemWithAttributes({ item, forSummary: true }),
  );

  const itemsSerializedFiltered = clientIsMember
    ? itemsSerialized
    : itemsSerialized.filter((item) => item.isPublic);

  return itemsSerializedFiltered;
};
