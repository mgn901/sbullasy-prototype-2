import { createMembership } from '../interactors/groups-memberships/createMembership.ts';
import { updateMembership } from '../interactors/groups-memberships/updateMembership.ts';
import { groupsGroupIdMembersUserIdPut } from '../schemas/groupsGroupIdMembersUserIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdMembersUserIdPutControllerFactory: TControllerFactory<
  typeof groupsGroupIdMembersUserIdPut
> = ({ repository, emailClient }) => ({
  method: 'put',
  url: '/groups/:groupId/members/:userId',
  handler: async (request, reply) => {
    const { userId, groupId } = request.params;
    const { type, invitationCode } = request.body;

    if (invitationCode) {
      await createMembership({
        repository,
        emailClient,
        query: { invitationCode },
        tokenFromClient: getTokenByRequest(request),
      });
      reply.status(201).send();
      return reply;
    }

    await updateMembership({
      repository,
      emailClient,
      query: { userId, groupId, type },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
