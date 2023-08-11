import { itemToItemWithAttributes } from '../../converters/itemToItemWithAttributes.ts';
import { IRequestFromUser } from '../../models/interfaces.ts';
import { IChallengeForPayload } from '../../schemas/IChallengeForPayload.ts';
import { IItemForPayload } from '../../schemas/IItemForPayload.ts';
import { IInteractorOptions } from '../IInteractorOptions.ts';
import { InvalidRequestError } from '../errors/InvalidRequestError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import { checkTokenOrThrow } from '../utils/checkTokenOrThrow.ts';

export const updateAnswer = async (
  options: IInteractorOptions<{
    requestId: IRequestFromUser['id'];
    value: IChallengeForPayload;
  }>,
): Promise<void> => {
  const { repository, query, tokenFromClient } = options;
  const { requestId, value } = query;
  const { requestSecret } = value;

  const token = await checkTokenOrThrow(
    repository,
    {
      requiresVerifiedUser: false,
    },
    tokenFromClient,
  );
  const userId = token.ownerId;

  const user = await repository.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      requests: {
        where: {
          id: requestId,
        },
      },
    },
  });
  if (!user) {
    throw new NotFoundError('The user you specified is not found.');
  }
  const request = user.requests[0];
  if (!request) {
    throw new NotFoundError('The request you specified is not found.');
  }

  if (request.secret !== requestSecret || !request.email) {
    throw new InvalidRequestError('The request secret you specified is wrong.');
  }

  // #region Find matched patterns (TODO: improve)

  const { email } = request;
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

  if (
    !patternToBeUsed ||
    !('expiresAt' in patternToBeUsed.attributes) ||
    typeof patternToBeUsed.attributes.expiresAt !== 'number'
  ) {
    throw new InvalidRequestError('You cannot verify yourself by the email address you specified.');
  }

  await repository.user.update({
    where: { id: userId },
    data: {
      verificationExpiresAt: patternToBeUsed.attributes.expiresAt,
    },
  });
};
