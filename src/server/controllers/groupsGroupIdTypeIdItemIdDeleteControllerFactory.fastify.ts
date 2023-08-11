import { deleteItem } from '../interactors/groups-items/deleteItem.ts';
import { groupsGroupIdTypeIdItemIdDelete } from '../schemas/groupsGroupIdTypeIdItemIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdTypeIdItemIdDeleteControllerFactory: TControllerFactory<
  typeof groupsGroupIdTypeIdItemIdDelete
> = ({ repository, emailClient }) => ({
  method: 'delete',
  url: '/groups/:groupId/:typeId/:itemId',
  handler: async (request, reply) => {
    const { groupId, typeId, itemId } = request.params;
    await deleteItem({
      repository,
      emailClient,
      query: { groupId, typeId, itemId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
  },
});
