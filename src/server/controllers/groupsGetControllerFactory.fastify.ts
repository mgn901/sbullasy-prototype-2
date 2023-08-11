import { findGroups } from '../interactors/groups/findGroups.ts';
import { groupsGet } from '../schemas/groupsGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGetControllerFactory: TControllerFactory<typeof groupsGet> = ({
  repository,
}) => ({
  method: 'get',
  url: '/groups',
  handler: async (request, reply) => {
    const result = await findGroups({
      repository,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
