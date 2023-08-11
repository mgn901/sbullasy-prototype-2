import { deleteMyToken } from '../interactors/users-tokens/deleteMyToken.ts';
import { usersMeTokensTokenIdDelete } from '../schemas/usersMeTokensTokenIdDelete.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const usersMeTokensTokenIdDeleteControllerFactory: TControllerFactory<
  typeof usersMeTokensTokenIdDelete
> = ({ repository, emailClient }) => ({
  method: 'delete',
  url: '/users/me/tokens/:tokenId',
  handler: async (request, reply) => {
    const { tokenId } = request.params;
    await deleteMyToken({
      repository,
      emailClient,
      query: { tokenId },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(204).send();
    return reply;
  },
});
