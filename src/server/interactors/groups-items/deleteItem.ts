import { IGroup, IItem } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteItem = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    typeId: NonNullable<IItem['typeId']>;
    itemId: IItem['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, typeId, itemId } = query;

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

  await repository.group.update({
    where: {
      id: groupId,
    },
    data: {
      items: {
        delete: {
          id: itemId,
          typeId,
        },
      },
    },
  });
};
