import { tokenToTokenSerializedForOwner } from '../../converters/tokenToTokenSerializedForOwner.ts';
import { ITokenSerializedForOwner } from '../../schemas/ITokenSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const findMyTokens = async (
  options: IInteractorOptions<{}>,
): Promise<ITokenSerializedForOwner[]> => {
  const { repository, tokenFromClient } = options;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
      requiresAdminUser: false,
      requiresAdminGroup: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const user = await repository.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      tokens: {
        select: {
          id: true,
          type: true,
          expiresAt: true,
        },
        include: {
          permission: {
            include: {
              grantsTo: true,
              targetType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError();
  }

  return user.tokens.map(tokenToTokenSerializedForOwner);
};
