import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IRequestFromUser } from '../../models/interfaces.ts';
import { IRequestFromUserSerializedForOwner } from '../../schemas/IRequestFromUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';
import { generateShortToken } from '../utils/generateShortToken.ts';

export const createMyVerificationRequest = async (
  options: IInteractorOptions<{
    email: string;
  }>,
): Promise<Pick<IRequestFromUserSerializedForOwner, 'id' | 'email' | 'type'>> => {
  const { repository, query, tokenFromClient } = options;
  const { email } = query;
  const now = dateToUnixTimeMillis(new Date());

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const request: IRequestFromUser = {
    id: generateId(),
    secret: generateShortToken(),
    email,
    type: 'verification',
    expiresAt: now + 2 * 60 * 1000,
    requestedFromId: userId,
  };

  await repository.user.update({
    where: { id: userId },
    data: {
      requests: {
        create: request,
      },
    },
  });

  const { id, type } = request;
  return { id, email, type };
};
