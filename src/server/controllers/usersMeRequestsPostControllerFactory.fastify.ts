import { createMyTokenRequest } from '../interactors/users-requests/createMyTokenRequest.ts';
import { createMyVerificationRequest } from '../interactors/users-requests/createMyVerificationRequest.ts';
import { usersMeRequestsPost } from '../schemas/usersMeRequestsPost.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeRequestsPostControllerFactory: TControllerFactory<
  typeof usersMeRequestsPost
> = ({ repository }) => ({
  method: 'post',
  url: '/users/me/requests',
  handler: async (request, reply) => {
    const { email, type } = request.body;
    const result = await (() => {
      if (type === 'token') {
        return createMyTokenRequest({
          repository,
          query: { email },
          tokenFromClient: getTokenByRequest(request),
        });
      }
      return createMyVerificationRequest({
        repository,
        query: { email },
        tokenFromClient: getTokenByRequest(request),
      });
    })();
    await reply.status(201).send(result);
    return reply;
  },
});
