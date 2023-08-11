import { findTypes } from '../interactors/types/findTypes.ts';
import { typesGet } from '../schemas/typesGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typesGetControllerFactory: TControllerFactory<typeof typesGet> = ({ repository }) => ({
  method: 'get',
  url: '/types',
  handler: async (request, reply) => {
    const result = await findTypes({
      repository,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
