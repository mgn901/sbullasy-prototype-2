import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';

export const rootViewRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{}> => ({
	method: 'GET',
	url: '/',
	handler: async (request, reply) => {
		await reply.sendFile('index.html');
	},
})
