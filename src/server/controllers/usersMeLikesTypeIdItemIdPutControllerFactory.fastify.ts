import { createMyBookmark } from '../interactors/users-likes/createMyBookmark.ts';
import { usersMeLikesTypeIdItemIdPut } from '../schemas/usersMeLikesTypeIdItemIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeLikesTypeIdItemIdPutControllerFactory: TControllerFactory<
  typeof usersMeLikesTypeIdItemIdPut
> = ({ repository, emailClient }) => ({
  method: 'put',
  url: '/users/me/likes/:typeId/:itemId',
  handler: async (request, reply) => {
    await createMyBookmark({
      repository,
      emailClient,
      query: request.params,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(201).send();
    return reply;
  },
});
