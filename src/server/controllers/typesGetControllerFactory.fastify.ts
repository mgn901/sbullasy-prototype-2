import { findTypes } from '../interactors/types/findTypes.ts';
import { typesGet } from '../schemas/typesGet.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typesGetControllerFactory: TControllerFactory<typeof typesGet> = ({
  repository,
  emailClient,
}) => ({
  method: 'get',
  url: '/types',
  handler: async (request, reply) => {
    const result = await findTypes({
      repository,
      emailClient,
      query: request.query,
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(200).send(result);
    return reply;
  },
});
