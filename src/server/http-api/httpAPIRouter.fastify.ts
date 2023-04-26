import { FastifyPluginAsync } from 'fastify';
import { placeCreateRouteOptions, placeDeleteRouteOptions, placeGetAllRouteOptions, placePutRouteOptions } from '../place/placeRouteOptions.fastify';
import { subjectCategoryCreateRouteOptions, subjectCategoryDeleteRouteOptions, subjectCategoryGetAllRouteOptions, subjectCategoryPutRouteOptions } from '../subject-category/subjectCategoryRouteOptions.fastify';
import { subjectSemesterCreateRouteOptions, subjectSemesterDeleteRouteOptions, subjectSemesterGetAllRouteOptions, subjectSemesterPutRouteOptions } from '../subject-semester/subjectSemesterRouteOptions.fastify';
import { subjectWeekCreateRouteOptions, subjectWeekDeleteRouteOptions, subjectWeekGetAllRouteOptions, subjectWeekPutRouteOptions } from '../subject-week/subjectWeekRouteOptions.fastify';
import { subjectDeleteRouteOptions, subjectGetAllRouteOptions, subjectGetRouteOptions, subjectPutRouteOptions } from '../subject/subjectRouteOptions.fastify';
import { teacherCreateRouteOptions, teacherDeleteRouteOptions, teacherGetAllRouteOptions, teacherPutRouteOptions } from '../teacher/teacherRouteOptions.fastify';
import { errorHandler } from './errorHandler.fastify';
import { IRouterOptions } from './IRouterOptions';

export const httpAPIRouter: FastifyPluginAsync<IRouterOptions> = async (instance, options) => {

	const repositories = options.repositories;

	instance.route(placePutRouteOptions(repositories));
	instance.route(placeCreateRouteOptions(repositories));
	instance.route(placeDeleteRouteOptions(repositories));
	instance.route(placeGetAllRouteOptions(repositories));

	instance.route(subjectGetRouteOptions(repositories));
	instance.route(subjectPutRouteOptions(repositories));
	instance.route(subjectDeleteRouteOptions(repositories));
	instance.route(subjectGetAllRouteOptions(repositories));

	instance.route(subjectCategoryPutRouteOptions(repositories));
	instance.route(subjectCategoryCreateRouteOptions(repositories));
	instance.route(subjectCategoryDeleteRouteOptions(repositories));
	instance.route(subjectCategoryGetAllRouteOptions(repositories));

	instance.route(subjectSemesterPutRouteOptions(repositories));
	instance.route(subjectSemesterCreateRouteOptions(repositories));
	instance.route(subjectSemesterDeleteRouteOptions(repositories));
	instance.route(subjectSemesterGetAllRouteOptions(repositories));

	instance.route(subjectWeekPutRouteOptions(repositories));
	instance.route(subjectWeekCreateRouteOptions(repositories));
	instance.route(subjectWeekDeleteRouteOptions(repositories));
	instance.route(subjectWeekGetAllRouteOptions(repositories));

	instance.route(teacherPutRouteOptions(repositories));
	instance.route(teacherCreateRouteOptions(repositories));
	instance.route(teacherDeleteRouteOptions(repositories));
	instance.route(teacherGetAllRouteOptions(repositories));

	instance.setErrorHandler(errorHandler);

}
