import { UnixTimeMillis, unixTimeMillisToDate } from '@mgn901/mgn901-utils-ts';
import { createMyBearerToken } from '../interactors/users-tokens/createMyBearerToken.ts';
import { createMyCookieToken } from '../interactors/users-tokens/createMyCookieToken.ts';
import { usersMeTokensPost } from '../schemas/usersMeTokensPost.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeTokensPostControllerFactory: TControllerFactory<typeof usersMeTokensPost> = ({
  repository,
}) => ({
  method: 'post',
  url: '/users/me/tokens',
  handler: async (request, reply) => {
    const { type, requestId, requestSecret, permissionId } = request.body;
    if (type === 'cookie') {
      const result = await createMyCookieToken({
        repository,
        query: { requestId, requestSecret },
        tokenFromClient: getTokenByRequest(request),
      });
      const { id, expiresAt } = result;
      await reply
        .setCookie('token', result.secret, {
          expires: unixTimeMillisToDate(expiresAt as UnixTimeMillis),
        })
        .status(201)
        .send({ id, secret: '', type, expiresAt });
      return reply;
    }

    const result = await createMyBearerToken({
      repository,
      query: { permissionId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(201).send(result);
    return reply;
  },
});
