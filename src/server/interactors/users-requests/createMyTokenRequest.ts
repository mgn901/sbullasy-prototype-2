import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IRequestFromUser, IUser } from '../../models/interfaces.ts';
import { IRequestFromUserSerializedForOwner } from '../../schemas/IRequestFromUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { generateId } from '../utils/generateId.ts';
import { generateShortToken } from '../utils/generateShortToken.ts';

export const createMyTokenRequest = async (
  options: IInteractorOptions<{
    email: IUser['email'];
  }>,
): Promise<Pick<IRequestFromUserSerializedForOwner, 'id' | 'email' | 'type'>> => {
  const { repository, query } = options;
  const { email } = query;
  const now = dateToUnixTimeMillis(new Date());

  const user = await (async () => {
    const returned = await repository.user.findUnique({
      where: { email },
    });
    if (returned) {
      return returned;
    }
    const generatedId = generateId();
    const newUser: IUser = {
      id: generatedId,
      email,
      name: email,
      displayName: email,
      registeredAt: null,
      registrationExpiresAt: now,
      verificationExpiresAt: now,
    };
    await repository.user.create({
      data: newUser,
    });
    return newUser;
  })();
  const userId = user.id;

  const request: IRequestFromUser = {
    id: generateId(),
    secret: generateShortToken(),
    type: 'token',
    email: null,
    requestedFromId: userId,
    expiresAt: now + 2 * 60 * 1000,
  };

  await repository.user.update({
    where: { id: userId },
    data: {
      requests: {
        create: {
          ...request,
        },
      },
    },
  });

  const { id, type } = request;
  return { id, email, type };
};
