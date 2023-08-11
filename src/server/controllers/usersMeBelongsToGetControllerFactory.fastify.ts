import { findMyMemberships } from '../interactors/users-memberships/findMyMemberships.ts';
import { usersMeBelongsToGet } from '../schemas/usersMeBelongsToGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeBelongsToGetControllerFactory: TControllerFactory<
  typeof usersMeBelongsToGet
> = ({ repository, emailClient }) => ({
  method: 'get',
  url: '/users/me/belongsTo',
  handler: async (request, reply) => {
    const result = await findMyMemberships({
      repository,
      emailClient,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
