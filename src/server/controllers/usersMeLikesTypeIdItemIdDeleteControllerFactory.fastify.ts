import { deleteMyBookmark } from '../interactors/users-likes/deleteMyBookmark.ts';
import { usersMeLikesTypeIdItemIdDelete } from '../schemas/usersMeLikesTypeIdItemIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeLikesTypeIdItemIdDeleteControllerFactory: TControllerFactory<
  typeof usersMeLikesTypeIdItemIdDelete
> = ({ repository }) => ({
  method: 'delete',
  url: '/users/me/likes/:typeId/:itemId',
  handler: async (request, reply) => {
    const { typeId, itemId } = request.params;
    await deleteMyBookmark({
      repository,
      query: { typeId, itemId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
