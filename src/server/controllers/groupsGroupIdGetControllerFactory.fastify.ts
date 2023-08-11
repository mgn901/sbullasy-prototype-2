import { findGroup } from '../interactors/groups/findGroup.ts';
import { groupsGroupIdGet } from '../schemas/groupsGroupIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdGetControllerFactory: TControllerFactory<typeof groupsGroupIdGet> = ({
  repository,
}) => ({
  method: 'get',
  url: '/groups/:groupId',
  handler: async (request, reply) => {
    const { groupId } = request.params;
    const result = await findGroup({
      repository,
      query: { groupId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
