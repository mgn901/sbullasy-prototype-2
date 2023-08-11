import { findItems } from '../interactors/items/findItems.ts';
import { typeIdGet } from '../schemas/typeIdGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typeIdGetControllerFactory: TControllerFactory<typeof typeIdGet> = ({
  repository,
}) => ({
  method: 'get',
  url: '/:typeId',
  handler: async (request, reply) => {
    const { typeId } = request.params;
    const result = await findItems({
      repository,
      query: { typeId, ...request.query },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
