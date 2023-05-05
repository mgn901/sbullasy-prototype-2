import { FastifyPluginAsync } from 'fastify';
import { IRouterOptions } from '../http-api/IRouterOptions';
import { rootViewRouteOptions, subjectViewRouteOptions } from './viewRouteOptions.fastify';
import { createErrorHandler } from './errorHandler.fastify';

export const httpViewRouter: FastifyPluginAsync<IRouterOptions> = async (instance, options) => {

	const infrastructures = options.infrastructures;
	const errorHandler = createErrorHandler(infrastructures)

	instance.route(rootViewRouteOptions(infrastructures));
	instance.route(subjectViewRouteOptions(infrastructures));

	instance.setErrorHandler(errorHandler);

}
