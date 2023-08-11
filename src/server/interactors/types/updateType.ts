import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { subtraction } from '../../../utils/subtraction.ts';
import { union } from '../../../utils/union.ts';
import { itemForPayloadToItem } from '../../converters/itemForPayloadToItem.ts';
import { IItem } from '../../models/interfaces.ts';
import { IItemForPayload } from '../../schemas/IItemForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const updateType = async (
  options: IInteractorOptions<{
    typeId: IItem['id'];
    value: IItemForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { typeId, value } = query;
  const now = dateToUnixTimeMillis(new Date());

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminUser: true,
    },
    tokenFromClient,
  );

  const rootType = await (async () => {
    const returned = await repository.item.findUnique({
      where: { id: 'root' },
      include: {
        attributes: true,
      },
    });
    if (!returned) {
      return repository.item.create({
        data: {
          id: 'root',
          name: 'root',
          createdAt: now,
          updatedAt: now,
          isPublic: true,
        },
        include: {
          attributes: true,
        },
      });
    }
    return returned;
  })();

  const itemExists = await repository.item.findUnique({
    where: { id: typeId },
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

  const itemToBeSaved = itemForPayloadToItem({
    item: value,
    itemId: typeId,
    type: itemExists?.type ?? rootType,
    attributesExists: itemExists?.attributes,
  });
  const itemToBeSavedSub = {
    createdAt: itemExists?.createdAt ?? now,
    updatedAt: itemExists?.updatedAt ?? now,
    typeId: 'root',
    isPublic: true,
    ownerId: token.ownerId,
  };
  const attributesToBeSavedForRepository = itemToBeSaved.attributes.map((attribute) => ({
    where: { id: attribute.id },
    create: attribute,
    update: attribute,
  }));

  const attributeIdsExists = itemExists?.attributes.map((attribute) => attribute.id) ?? [];
  const attributeIdsToBeSaved = itemToBeSaved.attributes.map((attribute) => attribute.id);
  const idsToBeDeleted = subtraction(
    union(attributeIdsExists, attributeIdsToBeSaved),
    attributeIdsToBeSaved,
  );
  const idsToBeDeletedForRepository = idsToBeDeleted.map((id) => ({ id }));

  await repository.item.upsert({
    where: {
      id: typeId,
    },
    create: {
      ...itemToBeSaved,
      ...itemToBeSavedSub,
      attributes: {
        createMany: {
          data: [...itemToBeSaved.attributes],
        },
      },
    },
    update: {
      ...itemToBeSaved,
      updatedAt: itemToBeSavedSub.updatedAt,
      attributes: {
        upsert: attributesToBeSavedForRepository,
        deleteMany: idsToBeDeletedForRepository,
      },
    },
  });
};
