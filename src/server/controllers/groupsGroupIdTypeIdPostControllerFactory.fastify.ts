import { createItem } from '../interactors/groups-items/createItem.ts';
import { groupsGroupIdTypeIdPost } from '../schemas/groupsGroupIdTypeIdPost.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsGroupIdTypeIdPostControllerFactory: TControllerFactory<
  typeof groupsGroupIdTypeIdPost
> = ({ repository, emailClient }) => ({
  method: 'post',
  url: '/groups/:groupId/:typeId',
  handler: async (request, reply) => {
    const { groupId, typeId } = request.params;
    const value = request.body;
    const result = await createItem({
      repository,
      emailClient,
      query: { groupId, typeId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
