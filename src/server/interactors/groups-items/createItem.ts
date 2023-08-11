import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { itemForPayloadToItem } from '../../converters/itemForPayloadToItem.ts';
import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IGroup, IItem } from '../../models/interfaces.ts';
import { IItemForPayload } from '../../schemas/IItemForPayload.ts';
import { IItemSerializedForPublic } from '../../schemas/IItemSerializedForPublic.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';

export const createItem = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    typeId: NonNullable<IItem['typeId']>;
    value: Pick<IItemForPayload, 'name' | 'isPublic' | 'attributes'>;
  }>,
): Promise<IItemSerializedForPublic> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, typeId, value } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      groupId,
      requiresAdminUser: false,
      itemTypeId: typeId,
      permissionType: 'write',
    },
    tokenFromClient,
  );

  const type = await repository.item.findUnique({
    where: {
      id: typeId,
    },
    include: {
      attributes: true,
    },
  });
  if (!type) {
    throw new NotFoundError('The type you specified is not found.');
  }

  const itemId = generateId();
  const now = dateToUnixTimeMillis(new Date());
  const itemToBeSaved = itemForPayloadToItem({
    item: value,
    itemId,
    type,
  });
  const itemToBeSavedSub = {
    createdAt: now,
    updatedAt: now,
    ownerId: groupId,
  };

  const itemSaved = await repository.item.create({
    data: {
      ...itemToBeSaved,
      ...itemToBeSavedSub,
      attributes: {
        createMany: {
          data: itemToBeSaved.attributes,
        },
      },
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

  return itemToItemWithAttributes({ item: itemSaved, forSummary: false });
};
