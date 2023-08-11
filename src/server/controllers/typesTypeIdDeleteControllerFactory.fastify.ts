import { deleteType } from '../interactors/types/deleteType.ts';
import { typesTypeIdDelete } from '../schemas/typesTypeIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const typesTypeIdDeleteControllerFactory: TControllerFactory<typeof typesTypeIdDelete> = ({
  repository,
}) => ({
  method: 'delete',
  url: '/types/:typeId',
  handler: async (request, reply) => {
    const { typeId } = request.params;
    await deleteType({
      repository,
      query: { typeId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
