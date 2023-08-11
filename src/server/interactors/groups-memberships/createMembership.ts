import { IGroup } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const createMembership = async (
  options: IInteractorOptions<{ invitationCode: IGroup['invitationCode'] }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { invitationCode } = query;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
    },
    tokenFromClient,
  );

  const userId = token.ownerId;

  const group = await repository.group.findUnique({
    where: { invitationCode },
  });

  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }

  await repository.group.update({
    where: {
      id: group.id,
    },
    data: {
      members: {
        create: {
          userId,
          type: 'member',
        },
      },
    },
  });
};
