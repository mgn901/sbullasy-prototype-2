import { findItems } from '../interactors/groups-items/findItems.ts';
import { groupsGroupIdTypeIdGet } from '../schemas/groupsGroupIdTypeIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdTypeIdGetControllerFactory: TControllerFactory<
  typeof groupsGroupIdTypeIdGet
> = ({ repository }) => ({
  method: 'get',
  url: '/groups/:groupId/:typeId',
  handler: async (request, reply) => {
    const { groupId, typeId } = request.params;
    const result = await findItems({
      repository,
      query: { groupId, typeId, ...request.query },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
