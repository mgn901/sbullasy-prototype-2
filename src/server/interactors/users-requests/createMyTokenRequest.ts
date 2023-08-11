import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IRequestFromUser, IUser } from '../../models/interfaces.ts';
import { IRequestFromUserSerializedForOwner } from '../../schemas/IRequestFromUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { createEmailForLogin } from '../utils/createEmailForLogin.ts';
import { createEmailForRegistration } from '../utils/createEmailForRegistration.ts';
import { generateId } from '../utils/generateId.ts';
import { generateShortToken } from '../utils/generateShortToken.ts';

export const createMyTokenRequest = async (
  options: IInteractorOptions<{
    email: IUser['email'];
  }>,
): Promise<Pick<IRequestFromUserSerializedForOwner, 'id' | 'email' | 'type'>> => {
  const { repository, emailClient, query } = options;
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

  const secret = generateShortToken();
  const request: IRequestFromUser = {
    id: generateId(),
    secret,
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
          id: request.id,
          secret: request.secret,
          type: request.type,
          email: request.email,
          expiresAt: request.expiresAt,
        },
      },
    },
  });

  const emailMessage = (() => {
    if (user.registeredAt === null) {
      return createEmailForRegistration(email, secret);
    }
    return createEmailForLogin(email, secret);
  })();
  emailClient.send(emailMessage);

  const { id, type } = request;
  return { id, email, type };
};
