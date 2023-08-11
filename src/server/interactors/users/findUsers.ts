import { userToUserSerializedForOwner } from '../../converters/userToUserSerializedForOwner.ts';
import { IUserSerializedForOwner } from '../../schemas/IUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { IInteractorQuery } from '../IInteractorQuery.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { convertQueryToPrismaSelectSubset } from '../utils/convertQueryToPrismaSelectSubset.ts';

export const findUsers = async (
  options: IInteractorOptions<
    IInteractorQuery<'id_asc' | 'id_desc' | 'email_asc' | 'email_desc' | 'name_asc' | 'name_desc'>
  >,
): Promise<IUserSerializedForOwner[]> => {
  const { repository, query, tokenFromClient } = options;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  const users = await repository.user.findMany(convertQueryToPrismaSelectSubset(query));
  return users.map(userToUserSerializedForOwner);
};