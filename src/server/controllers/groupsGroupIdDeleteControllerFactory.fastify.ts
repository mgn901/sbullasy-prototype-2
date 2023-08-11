import { deleteGroup } from '../interactors/groups/deleteGroup.ts';
import { groupsGroupIdDelete } from '../schemas/groupsGroupIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdDeleteControllerFactory: TControllerFactory<
  typeof groupsGroupIdDelete
> = ({ repository }) => ({
  method: 'delete',
  url: '/groups/:groupId',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    await deleteGroup({
      repository,
      query: { groupId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
