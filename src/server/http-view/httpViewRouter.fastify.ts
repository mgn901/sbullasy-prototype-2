import { FastifyPluginAsync } from 'fastify';
import { IRouterOptions } from '../http-api/IRouterOptions';
import { rootViewRouteOptions } from './viewRouteOptions.fastify';

export const httpViewRouter: FastifyPluginAsync<IRouterOptions> = async (instance, options) => {

	const repositories = options.repositories;

	instance.route(rootViewRouteOptions(repositories));

}
