import { FastifyPluginAsync } from 'fastify';
import { placeCreateRouteOptions, placeDeleteRouteOptions, placeGetAllRouteOptions, placePutRouteOptions } from '../place/placeRouteOptions.fastify';
import { subjectCategoryCreateRouteOptions, subjectCategoryDeleteRouteOptions, subjectCategoryGetAllRouteOptions, subjectCategoryPutRouteOptions } from '../subject-category/subjectCategoryRouteOptions.fastify';
import { subjectSemesterCreateRouteOptions, subjectSemesterDeleteRouteOptions, subjectSemesterGetAllRouteOptions, subjectSemesterPutRouteOptions } from '../subject-semester/subjectSemesterRouteOptions.fastify';
import { subjectWeekCreateRouteOptions, subjectWeekDeleteRouteOptions, subjectWeekGetAllRouteOptions, subjectWeekPutRouteOptions } from '../subject-week/subjectWeekRouteOptions.fastify';
import { subjectDeleteRouteOptions, subjectGetAllRouteOptions, subjectGetRouteOptions, subjectPutRouteOptions } from '../subject/subjectRouteOptions.fastify';
import { teacherCreateRouteOptions, teacherDeleteRouteOptions, teacherGetAllRouteOptions, teacherPutRouteOptions } from '../teacher/teacherRouteOptions.fastify';
import { userCreateIfNotExistsAndCreateSessionRequestCreateRouteOptions, userDeleteRouteOptions, userEditRouteOptions, userMeGetRouteOptions, userSessionDeleteRouteOptions, userSessionsCreateRouteOptions, userSessionsDeleteAllRouteOptions, userSessionsDeleteCurrentRouteOptions, userSessionsGetAllRouteOptions } from '../user/userRouteOptions.fastify';
import { IRouterOptions } from './IRouterOptions';
import { errorHandler } from './errorHandler.fastify';

export const httpAPIRouter: FastifyPluginAsync<IRouterOptions> = async (instance, options) => {

	const infrastructures = options.infrastructures;

	instance.route(userCreateIfNotExistsAndCreateSessionRequestCreateRouteOptions(infrastructures));
	instance.route(userDeleteRouteOptions(infrastructures));
	instance.route(userEditRouteOptions(infrastructures));
	instance.route(userMeGetRouteOptions(infrastructures));
	instance.route(userSessionsCreateRouteOptions(infrastructures));
	instance.route(userSessionsDeleteAllRouteOptions(infrastructures));
	instance.route(userSessionsDeleteCurrentRouteOptions(infrastructures));
	instance.route(userSessionDeleteRouteOptions(infrastructures));
	instance.route(userSessionsGetAllRouteOptions(infrastructures));

	instance.route(placePutRouteOptions(infrastructures));
	instance.route(placeCreateRouteOptions(infrastructures));
	instance.route(placeDeleteRouteOptions(infrastructures));
	instance.route(placeGetAllRouteOptions(infrastructures));

	instance.route(subjectGetRouteOptions(infrastructures));
	instance.route(subjectPutRouteOptions(infrastructures));
	instance.route(subjectDeleteRouteOptions(infrastructures));
	instance.route(subjectGetAllRouteOptions(infrastructures));

	instance.route(subjectCategoryPutRouteOptions(infrastructures));
	instance.route(subjectCategoryCreateRouteOptions(infrastructures));
	instance.route(subjectCategoryDeleteRouteOptions(infrastructures));
	instance.route(subjectCategoryGetAllRouteOptions(infrastructures));

	instance.route(subjectSemesterPutRouteOptions(infrastructures));
	instance.route(subjectSemesterCreateRouteOptions(infrastructures));
	instance.route(subjectSemesterDeleteRouteOptions(infrastructures));
	instance.route(subjectSemesterGetAllRouteOptions(infrastructures));

	instance.route(subjectWeekPutRouteOptions(infrastructures));
	instance.route(subjectWeekCreateRouteOptions(infrastructures));
	instance.route(subjectWeekDeleteRouteOptions(infrastructures));
	instance.route(subjectWeekGetAllRouteOptions(infrastructures));

	instance.route(teacherPutRouteOptions(infrastructures));
	instance.route(teacherCreateRouteOptions(infrastructures));
	instance.route(teacherDeleteRouteOptions(infrastructures));
	instance.route(teacherGetAllRouteOptions(infrastructures));

	instance.setErrorHandler(errorHandler);

}
