import { findItem } from '../interactors/groups-items/findItem.ts';
import { groupsGroupIdTypeIdItemIdGet } from '../schemas/groupsGroupIdTypeIdItemIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdTypeIdItemIdGetControllerFactory: TControllerFactory<
  typeof groupsGroupIdTypeIdItemIdGet
> = ({ repository, emailClient }) => ({
  method: 'get',
  url: '/groups/:groupId/:typeId/:itemId',
  handler: async (request, reply) => {
    const { groupId, typeId, itemId } = request.params;
    const result = await findItem({
      repository,
      emailClient,
      query: { groupId, typeId, itemId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
