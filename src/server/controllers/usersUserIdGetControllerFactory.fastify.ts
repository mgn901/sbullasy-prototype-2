import { findMe } from '../interactors/users/findMe.ts';
import { findUser } from '../interactors/users/findUser.ts';
import { usersUserIdGet } from '../schemas/usersUserIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersUserIdGetControllerFactory: TControllerFactory<typeof usersUserIdGet> = ({
  repository,
  emailClient,
}) => ({
  method: 'get',
  url: '/users/:userId',
  handler: async (request, reply) => {
    const { userId } = request.params;
    const result = await (async () => {
      if (userId === 'me') {
        return findMe({
          repository,
          emailClient,
          query: request.query,
          tokenFromClient: getTokenByRequest(request),
        });
      }
      return findUser({
        repository,
        emailClient,
        query: { userId },
        tokenFromClient: getTokenByRequest(request),
      });
    })();
    await reply.status(200).send(result);
    return reply;
  },
});
