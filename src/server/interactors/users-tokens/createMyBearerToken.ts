import { tokenToTokenSerializedForOwner } from '../../converters/tokenToTokenSerializedForOwner.ts';
import { IPermission, IToken } from '../../models/interfaces.ts';
import { ITokenSerializedForOwner } from '../../schemas/ITokenSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';
import { generateLongToken } from '../utils/generateLongToken.ts';

export const createMyBearerToken = async (
  options: IInteractorOptions<{
    permissionId: IPermission['id'];
  }>,
): Promise<ITokenSerializedForOwner> => {
  const { repository, query, tokenFromClient } = options;

  const { permissionId } = query;
  const permission = await repository.permission.findUnique({
    where: {
      id: permissionId,
    },
    include: {
      grantsTo: true,
      targetType: {
        include: {
          attributes: true,
        },
      },
    },
  });
  if (!permission) {
    throw new NotFoundError('The permission you specified is not found.');
  }
  const groupId = permission.grantsToId;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: true,
      groupId,
      requiresAdminUser: true,
    },
    tokenFromClient,
  );
  const userId = token.id;

  const newToken: IToken = {
    id: generateId(),
    secret: generateLongToken(),
    type: 'bearer',
    expiresAt: 30 * 24 * 60 * 60 * 1000,
    ownerId: userId,
    permissionId,
  };

  await repository.user.update({
    where: { id: userId },
    data: {
      tokens: {
        create: newToken,
      },
    },
  });

  return tokenToTokenSerializedForOwner({ ...newToken, permission });
};
