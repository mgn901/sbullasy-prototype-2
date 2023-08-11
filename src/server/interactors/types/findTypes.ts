import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IItemWithAttributes } from '../../schemas/IItemWithAttributes.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';

export const findTypes = async (
  options: IInteractorOptions<{}>,
): Promise<IItemWithAttributes[]> => {
  const { repository } = options;

  const items = await repository.item.findMany({
    where: {
      typeId: 'root',
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
  });

  return items.map((item) => itemToItemWithAttributes({ item, forSummary: false }));
};
