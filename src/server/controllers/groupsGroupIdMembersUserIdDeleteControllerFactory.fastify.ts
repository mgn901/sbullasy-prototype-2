import { deleteMembership } from '../interactors/groups-memberships/deleteMembership.ts';
import { groupsGroupIdMembersUserIdDelete } from '../schemas/groupsGroupIdMembersUserIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdMembersUserIdDeleteControllerFactory: TControllerFactory<
  typeof groupsGroupIdMembersUserIdDelete
> = ({ repository }) => ({
  method: 'delete',
  url: '/groups/:groupId/members/:userId',
  handler: async (request, reply) => {
    const { groupId, userId } = request.params;
    await deleteMembership({
      repository,
      query: { groupId, userId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
