import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { tokenToTokenSerializedForOwner } from '../../converters/tokenToTokenSerializedForOwner.ts';
import { IRequestFromUser, IToken } from '../../models/interfaces.ts';
import { ITokenSerializedForOwner } from '../../schemas/ITokenSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidRequestError } from '../errors/InvalidRequestError.ts';
import { generateId } from '../utils/generateId.ts';
import { generateLongToken } from '../utils/generateLongToken.ts';

export const createMyCookieToken = async (
  options: IInteractorOptions<{
    requestId: IRequestFromUser['id'];
    requestSecret: IRequestFromUser['secret'];
  }>,
): Promise<Pick<ITokenSerializedForOwner, 'id' | 'secret' | 'type' | 'expiresAt'>> => {
  const { repository, query } = options;
  const { requestId, requestSecret } = query;
  const now = dateToUnixTimeMillis(new Date());

  const request = await repository.requestFromUser.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request || request.secret !== requestSecret || request.type !== 'token') {
    throw new InvalidRequestError();
  }

  const userId = request.requestedFromId;
  const token: IToken = {
    id: generateId(),
    secret: generateLongToken(),
    type: 'cookie',
    ownerId: userId,
    expiresAt: now + 365 * 24 * 60 * 60 * 1000,
    permissionId: null,
  };

  await repository.user.update({
    where: { id: userId },
    data: {
      tokens: {
        create: token,
      },
    },
  });

  return tokenToTokenSerializedForOwner({ ...token, permission: null });
};
