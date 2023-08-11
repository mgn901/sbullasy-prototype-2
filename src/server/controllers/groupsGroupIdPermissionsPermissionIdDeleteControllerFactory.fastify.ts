import { deletePermission } from '../interactors/groups-permissions/deletePermission.ts';
import { groupsGroupIdPermissionsPermissionIdDelete } from '../schemas/groupsGroupIdPermissionsPermissionIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdPermissionsPermissionIdDeleteControllerFactory: TControllerFactory<
  typeof groupsGroupIdPermissionsPermissionIdDelete
> = ({ repository, emailClient }) => ({
  method: 'delete',
  url: '/groups/:groupId/permissions/:permissionId',
  handler: async (request, reply) => {
    const { groupId, permissionId } = request.params;
    await deletePermission({
      repository,
      emailClient,
      query: { groupId, permissionId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
