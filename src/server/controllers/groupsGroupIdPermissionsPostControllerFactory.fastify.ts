import { createPermission } from '../interactors/groups-permissions/createPermission.ts';
import { groupsGroupIdPermissionsPost } from '../schemas/groupsGroupIdPermissionsPost.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdPermissionsPostControllerFactory: TControllerFactory<
  typeof groupsGroupIdPermissionsPost
> = ({ repository }) => ({
  method: 'post',
  url: '/groups/:groupId/permissions',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    const value = request.body;
    const result = await createPermission({
      repository,
      query: { groupId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(201).send(result);
    return reply;
  },
});
