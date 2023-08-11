import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { groupToGroupSerializedForAdmin } from '../../converters/groupToGroupSerializedForAdmin.ts';
import { IGroup } from '../../models/interfaces.ts';
import { IGroupForPayload } from '../../schemas/IGroupForPayload.ts';
import { IGroupSerializedForAdmin } from '../../schemas/IGroupSerializedForAdmin.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';
import { generateShortToken } from '../utils/generateShortToken.ts';

export const createGroup = async (
  options: IInteractorOptions<{
    value: Pick<IGroupForPayload, 'name' | 'displayName'>;
  }>,
): Promise<IGroupSerializedForAdmin> => {
  const { repository, query, tokenFromClient } = options;
  const { value } = query;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
    },
    tokenFromClient,
  );

  const userId = token.ownerId;
  const groupId = generateId();
  const groupWithId: IGroup = {
    ...value,
    id: groupId,
    createdAt: dateToUnixTimeMillis(new Date()),
    isAdmin: false,
    invitationCode: generateShortToken(),
  };

  await repository.group.create({
    data: groupWithId,
  });

  await repository.group.update({
    where: { id: groupId },
    data: {
      members: {
        create: {
          type: 'admin',
          userId,
        },
      },
    },
  });

  return groupToGroupSerializedForAdmin(groupWithId);
};
