import { updateMe } from '../interactors/users/updateMe.ts';
import { updateUser } from '../interactors/users/updateUser.ts';
import { usersUserIdPut } from '../schemas/usersUserIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersUserIdPutControllerFactory: TControllerFactory<typeof usersUserIdPut> = ({
  repository,
  emailClient,
}) => ({
  method: 'put',
  url: '/users/:userId',
  handler: async (request, reply) => {
    const { userId } = request.params;
    const value = request.body;
    if (userId === 'me') {
      await updateMe({
        repository,
        emailClient,
        query: { value },
        tokenFromClient: getTokenByRequest(request),
      });
    } else {
      await updateUser({
        repository,
        emailClient,
        query: { userId, value },
        tokenFromClient: getTokenByRequest(request),
      });
    }
    await reply.status(204).send();
    return reply;
  },
});
