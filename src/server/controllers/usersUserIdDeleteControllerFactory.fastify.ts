import { deleteMe } from '../interactors/users/deleteMe.ts';
import { deleteUser } from '../interactors/users/deleteUser.ts';
import { usersUserIdDelete } from '../schemas/usersUserIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersUserIdDeleteControllerFactory: TControllerFactory<typeof usersUserIdDelete> = ({
  repository,
}) => ({
  method: 'delete',
  url: '/users/:userId',
  handler: async (request, reply) => {
    const { userId } = request.params;
    if (userId === 'me') {
      await deleteMe({
        repository,
        query: request.query,
        tokenFromClient: getTokenByRequest(request),
      });
    } else {
      await deleteUser({
        repository,
        query: { userId },
        tokenFromClient: getTokenByRequest(request),
      });
    }
    await reply.status(204).send();
    return reply;
  },
});
