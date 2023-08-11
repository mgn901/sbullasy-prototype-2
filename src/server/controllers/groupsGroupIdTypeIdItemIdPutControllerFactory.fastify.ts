import { updateItem } from '../interactors/groups-items/updateItem.ts';
import { groupsGroupIdTypeIdItemIdPut } from '../schemas/groupsGroupIdTypeIdItemIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdTypeIdItemIdPutControllerFactory: TControllerFactory<
  typeof groupsGroupIdTypeIdItemIdPut
> = ({ repository, emailClient }) => ({
  method: 'put',
  url: '/groups/:groupId/:typeId/:itemId',
  handler: async (request, reply) => {
    const { groupId, typeId, itemId } = request.params;
    const value = request.body;
    await updateItem({
      repository,
      emailClient,
      query: { groupId, typeId, itemId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
