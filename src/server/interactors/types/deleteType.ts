import { IItem } from '../../models/interfaces.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const deleteType = async (
  options: IInteractorOptions<{
    typeId: IItem['id'];
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { typeId } = query;

  await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      requiresAdminGroup: true,
    },
    tokenFromClient,
  );

  const { count } = await repository.item.deleteMany({
    where: {
      id: typeId,
    },
  });
  if (count === 0) {
    throw new NotFoundError('The item you specified is not found.');
  }
};
