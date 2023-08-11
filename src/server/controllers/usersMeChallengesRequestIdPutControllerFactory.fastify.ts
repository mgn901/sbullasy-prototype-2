import { updateAnswer } from '../interactors/user-challenges/updateAnswer.ts';
import { usersMeChallengesRequestIdPut } from '../schemas/usersMeChallengesRequestIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeChallengesRequestIdPutControllerFactory: TControllerFactory<
  typeof usersMeChallengesRequestIdPut
> = ({ repository }) => ({
  method: 'put',
  url: '/users/me/challenges/:requestId',
  handler: async (request, reply) => {
    const { requestId } = request.params;
    const value = request.body;
    await updateAnswer({
      repository,
      query: { requestId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
