import { findPermissions } from '../interactors/groups-permissions/findPermissions.ts';
import { groupsGroupIdPermissionsGet } from '../schemas/groupsGroupIdPermissionsGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdPermissionsGetControllerFactory: TControllerFactory<
  typeof groupsGroupIdPermissionsGet
> = ({ repository }) => ({
  method: 'get',
  url: '/groups/:groupId/permissions',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    const result = await findPermissions({
      repository,
      query: { groupId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
