import { createGroup } from '../interactors/groups/createGroup.ts';
import { groupsPost } from '../schemas/groupsPost.ts';
import { TControllerFactory } from './TControllerFactory.ts';
import { getTokenByRequest } from './utils/getTokenByRequest.fastify.ts';

export const groupsPostControllerFactory: TControllerFactory<typeof groupsPost> = ({
  repository,
  emailClient,
}) => ({
  method: 'post',
  url: '/groups',
  handler: async (request, reply) => {
    const value = request.body;
    const result = await createGroup({
      repository,
      emailClient,
      query: { value },
      tokenFromClient: getTokenByRequest(request),
    });
    await reply.status(201).send(result);
    return reply;
  },
});
