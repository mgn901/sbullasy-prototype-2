import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { itemToItemWithOwner } from '../../converters/itemToItemWithOwner.ts';
import { IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IItemWithOwner } from '../../schemas/IItemWithOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { convertQueryToPrismaSelectSubset } from '../utils/convertQueryToPrismaSelectSubset.ts';

export const findItems = async (
  options: IInteractorOptions<
    {
      typeId: NonNullable<IItem['typeId']>;
    } & IInteractorQuery
  >,
): Promise<(IItemWithOwner & IItemWithAttributes)[]> => {
  const { repository, query } = options;
  const { typeId } = query;

  const items = await repository.item.findMany({
    where: {
      typeId,
      isPublic: true,
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
    ...convertQueryToPrismaSelectSubset(query),
  });

  const itemsSerialized: IItemWithAttributes[] = items.map((item) => ({
    ...itemToItemWithOwner(item),
    ...itemToItemWithAttributes({ item, forSummary: true }),
  }));

  const itemsSerializedFiltered = itemsSerialized.filter((item) => item.isPublic);

  return itemsSerializedFiltered;
};
