import { updateType } from '../interactors/types/updateType.ts';
import { typesTypeIdPut } from '../schemas/typesTypeIdPut.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typesTypeIdPutControllerFactory: TControllerFactory<typeof typesTypeIdPut> = ({
  repository,
}) => ({
  method: 'put',
  url: '/types/:typeId',
  handler: async (request, reply) => {
    const { typeId } = request.params;
    const value = request.body;
    await updateType({
      repository,
      query: { typeId, value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
