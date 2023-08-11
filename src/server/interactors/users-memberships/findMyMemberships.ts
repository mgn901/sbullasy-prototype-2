import { membershipToMembershipWithGroupForMember } from '../../converters/membershipToMembershipWithGroupForMember.ts';
import { IMembershipWithGroupForMember } from '../../schemas/IMembershipWithGroupForMember.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findMyMemberships = async (
  options: IInteractorOptions<IInteractorQuery<'id_asc' | 'id_desc' | 'name_asc' | 'name_desc'>>,
): Promise<IMembershipWithGroupForMember[]> => {
  const { repository, tokenFromClient } = options;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const user = await repository.user.findUnique({
    where: { id: userId },
    include: {
      belongsTo: {
        include: {
          group: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('The user not found.');
  }

  return user.belongsTo.map(membershipToMembershipWithGroupForMember);
};