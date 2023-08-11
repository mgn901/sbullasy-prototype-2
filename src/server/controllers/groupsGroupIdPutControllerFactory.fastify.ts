import { updateGroup } from '../interactors/groups/updateGroup.ts';
import { groupsGroupIdPut } from '../schemas/groupsGroupIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdPutControllerFactory: TControllerFactory<typeof groupsGroupIdPut> = ({
  repository,
  emailClient,
}) => ({
  method: 'put',
  url: '/groups/:groupId',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    const value = request.body;
    await updateGroup({
      repository,
      emailClient,
      query: { groupId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
