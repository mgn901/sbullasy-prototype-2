import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { itemToItemWithOwner } from '../../converters/itemToItemWithOwner.ts';
import { IItem } from '../../models/interfaces.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IItemWithOwner } from '../../schemas/IItemWithOwner.ts';
import { IInteractorCalendarQuery } from '../IInteractorCalendarQuery.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { convertCalendarQueryToSelectSubset } from '../utils/convertCalendarQueryToSelectSubset.ts';
import { convertQueryToPrismaSelectSubset } from '../utils/convertQueryToPrismaSelectSubset.ts';

export const findItems = async (
  options: IInteractorOptions<
    {
      typeId: NonNullable<IItem['typeId']>;
    } & (IInteractorQuery<'updatedAt_desc'> | IInteractorCalendarQuery)
  >,
): Promise<(IItemWithOwner & IItemWithAttributes)[]> => {
  const { repository, query } = options;
  const { typeId } = query;

  const items = await repository.item.findMany({
    where: {
      typeId,
      isPublic: true,
      ...('calendarKey' in query ? convertCalendarQueryToSelectSubset(query) : {}),
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
