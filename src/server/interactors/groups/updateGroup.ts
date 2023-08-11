import { IGroup } from '../../models/interfaces.ts';
import { IGroupForPayload } from '../../schemas/IGroupForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';

export const updateGroup = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
    value: IGroupForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId, value } = query;
  const { name, displayName, resetInvitationCode } = value;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      groupId,
      requiresAdminUser: true,
    },
    tokenFromClient,
  );

  const { count } = await repository.group.updateMany({
    where: {
      id: groupId,
    },
    data: {
      name,
      displayName,
      invitationCode: resetInvitationCode ? generateId() : undefined,
    },
  });

  if (count === 0) {
    throw new NotFoundError('The group you specified is not found.');
  }
};
