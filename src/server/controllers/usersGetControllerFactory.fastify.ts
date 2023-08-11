import { findUsers } from '../interactors/users/findUsers.ts';
import { usersGet } from '../schemas/usersGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersGetControllerFactory: TControllerFactory<typeof usersGet> = ({
  repository,
  emailClient,
}) => ({
  method: 'get',
  url: '/users',
  handler: async (request, reply) => {
    const result = await findUsers({
      repository,
      emailClient,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
