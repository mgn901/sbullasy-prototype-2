import { findMyBookmarks } from '../interactors/users-likes/findMyBookmarks.ts';
import { usersMeLikesTypeIdGet } from '../schemas/usersMeLikesTypeIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeLikesTypeIdGetControllerFactory: TControllerFactory<
  typeof usersMeLikesTypeIdGet
> = ({ repository, emailClient }) => ({
  method: 'get',
  url: '/users/me/likes/:typeId',
  handler: async (request, reply) => {
    const { typeId } = request.params;
    const result = await findMyBookmarks({
      repository,
      emailClient,
      query: { ...request.query, typeId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
  },
});
