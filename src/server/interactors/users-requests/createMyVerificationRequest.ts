import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IRequestFromUser } from '../../models/interfaces.ts';
import { IItemForPayload } from '../../schemas/IItemForPayload.ts';
import { IRequestFromUserSerializedForOwner } from '../../schemas/IRequestFromUserSerializedForOwner.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidRequestError } from '../errors/InvalidRequestError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';
import { generateId } from '../utils/generateId.ts';
import { generateShortToken } from '../utils/generateShortToken.ts';
import { createEmailForVerification } from '../utils/createEmailForVerification.ts';

export const createMyVerificationRequest = async (
  options: IInteractorOptions<{
    email: string;
  }>,
): Promise<Pick<IRequestFromUserSerializedForOwner, 'id' | 'email' | 'type'>> => {
  const { repository, emailClient, query, tokenFromClient } = options;
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

  // #region Find matched patterns (TODO: improve)

  const patternsAllowed = await repository.item.findMany({
    where: {
      typeId: 'instance-settings',
      name: 'users.verification.emailPatternsAllowed',
    },
    include: {
      type: {
        include: {
          attributes: true,
        },
      },
      attributes: {
        include: {
          valueItem: true,
        },
      },
    },
  });

  const patternsMatched = patternsAllowed
    .map((item) => itemToItemWithAttributes({ item, forSummary: false }))
    .filter((pattern) => {
      if ('regexp' in pattern.attributes && typeof pattern.attributes.regexp === 'string') {
        return new RegExp(pattern.attributes.regexp).test(email);
      }
      return false;
    });
  const patternToBeUsed = patternsMatched.reduce<IItemForPayload | undefined>((prev, current) => {
    if (
      prev &&
      'expiresAt' in prev.attributes &&
      typeof prev.attributes.expiresAt === 'number' &&
      'expiresAt' in current.attributes &&
      typeof current.attributes.expiresAt === 'number'
    ) {
      if (prev.attributes.expiresAt < current.attributes.expiresAt) {
        return prev;
      }
    }
    return current;
  }, undefined);

  // #endregion

  if (!patternToBeUsed || !('expiresAt' in patternToBeUsed.attributes)) {
    throw new InvalidRequestError('You cannot verify yourself by the email address you specified.');
  }

  const secret = generateShortToken();
  const request: IRequestFromUser = {
    id: generateId(),
    secret,
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

  const emailMessage = createEmailForVerification(email, secret);
  emailClient.send(emailMessage);

  const { id, type } = request;
  return { id, email, type };
};
