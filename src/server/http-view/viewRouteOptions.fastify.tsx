import { IRepositories } from '../http-api/IRepositories';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';

export const rootViewRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{}> => ({
	method: 'GET',
	url: '/',
	handler: async (request, reply) => {
		await reply.sendFile('index.html');
	},
})
