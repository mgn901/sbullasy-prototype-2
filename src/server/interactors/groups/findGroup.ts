import { groupToGroupSerializedForAdmin } from '../../converters/groupToGroupSerializedForAdmin.ts';
import { groupToGroupSerializedForPublic } from '../../converters/groupToGroupSerializedForPublic.ts';
import { IGroup } from '../../models/interfaces.ts';
import { IGroupSerializedForAdmin } from '../../schemas/IGroupSerializedForAdmin.ts';
import { IGroupSerializedForPublic } from '../../schemas/IGroupSerializedForPublic.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidTokenError } from '../errors/InvalidTokenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findGroup = async (
  options: IInteractorOptions<{
    groupId: IGroup['id'];
  }>,
): Promise<IGroupSerializedForAdmin | IGroupSerializedForPublic> => {
  const { repository, query, tokenFromClient } = options;
  const { groupId } = query;

  const clientIsAdmin = await (async () => {
    try {
      await checkTokenOrThrow(
        repository,
        {
          requiresVerifiedUser: true,
          groupId,
          requiresAdminUser: true,
        },
        tokenFromClient,
      );
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return false;
      }
      throw error;
    }
  })();

  const group = await repository.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new NotFoundError('The group you specified is not found.');
  }

  if (clientIsAdmin) {
    return groupToGroupSerializedForAdmin(group);
  }

  return groupToGroupSerializedForPublic(group);
};
