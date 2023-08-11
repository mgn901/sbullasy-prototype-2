import { membershipToMembershipWithUserForMember } from '../../converters/membershipToMembershipWithUserForMember.ts';
import { IGroup } from '../../models/interfaces.ts';
import { IMembershipWithUserForMember } from '../../schemas/IMembershipWithUserForMember.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findMemberships = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
  }>,
): Promise<IMembershipWithUserForMember[]> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      groupId,
      requiresAdminUser: false,
    },
    tokenFromClient,
  );

  const group = await repository.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }

  return group.members.map(membershipToMembershipWithUserForMember);
};
