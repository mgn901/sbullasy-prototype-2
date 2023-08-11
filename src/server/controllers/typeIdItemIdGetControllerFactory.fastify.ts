import { findItem } from '../interactors/items/findItem.ts';
import { typeIdItemIdGet } from '../schemas/typeIdItemIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typeIdItemIdGetControllerFactory: TControllerFactory<typeof typeIdItemIdGet> = ({
  repository,
}) => ({
  method: 'get',
  url: '/:typeId/:itemId',
  handler: async (request, reply) => {
    const { typeId, itemId } = request.params;
    const result = await findItem({
      repository,
      query: { typeId, itemId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
