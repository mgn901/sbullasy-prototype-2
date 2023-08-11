import { findMyTokens } from '../interactors/users-tokens/findMyTokens.ts';
import { usersMeTokensGet } from '../schemas/usersMeTokensGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeTokensGetControllerFactory: TControllerFactory<typeof usersMeTokensGet> = ({
  repository,
}) => ({
  method: 'get',
  url: '/users/me/tokens',
  handler: async (request, reply) => {
    const result = await findMyTokens({
      repository,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
