import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { subtraction } from '../../../utils/subtraction.ts';
import { union } from '../../../utils/union.ts';
import { itemForPayloadToItem } from '../../converters/itemForPayloadToItem.ts';
import { IGroup, IItem } from '../../models/interfaces.ts';
import { IItemForPayload } from '../../schemas/IItemForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { pick } from '../utils/pick.ts';

export const updateItem = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    typeId: NonNullable<IItem['typeId']>;
    itemId: IItem['id'];
    value: IItemForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, typeId, itemId, value } = query;

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
  const group = await repository.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      items: {
        where: {
          id: itemId,
        },
        include: {
          attributes: {
            include: {
              valueItem: true,
            },
          },
        },
      },
    },
  });
  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }
  const itemExists = group.items[0];
  if (!itemExists) {
    throw new NotFoundError('The item you specified is not found.');
  }

  const now = dateToUnixTimeMillis(new Date());

  const itemToBeSaved = itemForPayloadToItem({
    item: value,
    itemId,
    type,
    attributesExists: itemExists.attributes,
  });
  const attributesToBeSavedForRepository = itemToBeSaved.attributes.map((attribute) => ({
    where: { id: attribute.id },
    create: pick(attribute, [
      'id',
      'key',
      'parentItemTypeId',
      'showOnSummary',
      'valueBoolean',
      'valueItemId',
      'valueNumber',
      'valueString',
    ]),
    update: pick(attribute, [
      'id',
      'key',
      'parentItemTypeId',
      'showOnSummary',
      'valueBoolean',
      'valueItemId',
      'valueNumber',
      'valueString',
    ]),
  }));

  const attributeIdsExists = itemExists.attributes.map((attribute) => attribute.id);
  const attributeIdsToBeSaved = itemToBeSaved.attributes.map((attribute) => attribute.id);
  const idsToBeDeleted = subtraction(
    union(attributeIdsExists, attributeIdsToBeSaved),
    attributeIdsToBeSaved,
  );
  const idsToBeDeletedForRepository = idsToBeDeleted.map((id) => ({ id }));

  await repository.group.update({
    where: { id: groupId },
    data: {
      items: {
        upsert: {
          where: {
            id: itemId,
          },
          create: {
            ...itemToBeSaved,
            createdAt: now,
            updatedAt: now,
            attributes: {
              createMany: {
                data: itemToBeSaved.attributes.map((attribute) =>
                  pick(attribute, [
                    'id',
                    'key',
                    'parentItemTypeId',
                    'showOnSummary',
                    'valueBoolean',
                    'valueItemId',
                    'valueNumber',
                    'valueString',
                  ]),
                ),
              },
            },
          },
          update: {
            ...itemToBeSaved,
            updatedAt: now,
            attributes: {
              upsert: attributesToBeSavedForRepository,
              deleteMany: idsToBeDeletedForRepository,
            },
          },
        },
      },
    },
  });
};
