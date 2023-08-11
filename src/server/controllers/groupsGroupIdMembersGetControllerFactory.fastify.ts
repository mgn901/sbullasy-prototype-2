import { findMemberships } from '../interactors/groups-memberships/findMemberships.ts';
import { groupsGroupIdMembersGet } from '../schemas/groupsGroupIdMembersGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdMembersGetControllerFactory: TControllerFactory<
  typeof groupsGroupIdMembersGet
> = ({ repository, emailClient }) => ({
  method: 'get',
  url: '/groups/:groupId/members',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    const result = await findMemberships({
      repository,
      emailClient,
      query: { groupId, ...request.query },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
