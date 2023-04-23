import fastifyEtag from '@fastify/etag';
import fastifyHelmet, { FastifyHelmetOptions } from '@fastify/helmet';
import fastify, { FastifyHttpOptions, FastifyListenOptions } from 'fastify';
import { Server } from 'http';
import { createTables } from '../database/createTables.kysely';
import { db } from '../database/db.kysely';
import { GroupTagRepository } from '../group-tag/GroupTagRepository.kysely';
import { GroupRepository } from '../group/GroupRepository.kysely';
import { IRouterOptions, router } from '../http-api/router.fastify';
import { PageTagRepository } from '../page-tag/PageTagRepository.kysely';
import { PageRepository } from '../page/PageRepository.kysely';
import { PlaceRepository } from '../place/PlaceRepository.kysely';
import { SubjectCategoryRepository } from '../subject-category/SubjectCategoryRepository.kysely';
import { SubjectSemesterRepository } from '../subject-semester/SubjectSemesterRepository.kysely';
import { SubjectWeekRepository } from '../subject-week/SubjectWeekRepository.kysely';
import { SubjectRepository } from '../subject/SubjectRepository.kysely';
import { TeacherRepository } from '../teacher/TeacherRepository.kysely';
import { UserTagRepository } from '../user-tag/UserTagRepository.kysely';
import { UserRepository } from '../user/UserRepository.kysely';
import { startInteractor } from './startInteractor';

export const start = async () => {
	const {
		SBULLASY_APP_HOST,
		SBULLASY_APP_PORT,
		SBULLASY_APP_DB_HOST,
		SBULLASY_APP_DB_PORT,
		SBULLASY_APP_DB_USERNAME,
		SBULLASY_APP_DB_DB,
		SBULLASY_APP_ADMIN_EMAIL,
		SBULLASY_APP_ADMIN_PASSWORD,
		SBULLASY_APP_ADMIN_DISPLAYNAME,
	} = process.env;
	const envs = {
		SBULLASY_APP_HOST,
		SBULLASY_APP_PORT,
		SBULLASY_APP_DB_HOST,
		SBULLASY_APP_DB_PORT,
		SBULLASY_APP_DB_USERNAME,
		SBULLASY_APP_DB_DB,
		SBULLASY_APP_ADMIN_EMAIL,
		SBULLASY_APP_ADMIN_PASSWORD,
		SBULLASY_APP_ADMIN_DISPLAYNAME,
	};
	const EnvsIncludesUndefined = Object.entries(envs).map(([key, value]) => value).includes(undefined);
	if (EnvsIncludesUndefined) {
		throw new Error('Necessary envs are not passed');
	}

	await createTables(db);

	const userRepository = new UserRepository();
	const groupRepository = new GroupRepository();
	const pageRepository = new PageRepository();
	const groupTagRepository = new GroupTagRepository();
	const pageTagRepository = new PageTagRepository();
	const placeRepository = new PlaceRepository();
	const subjectRepository = new SubjectRepository();
	const subjectCategoryRepository = new SubjectCategoryRepository();
	const subjectSemesterRepository = new SubjectSemesterRepository();
	const subjectWeekRepository = new SubjectWeekRepository();
	const teacherRepository = new TeacherRepository();
	const userTagRepository = new UserTagRepository();

	await startInteractor({
		input: {
			user: {
				email: SBULLASY_APP_ADMIN_EMAIL!,
				displayName: SBULLASY_APP_ADMIN_DISPLAYNAME!,
			},
		},
		repository: userRepository,
		userTagRepository: userTagRepository,
	});

	const instanceOptions: FastifyHttpOptions<Server> = {
		logger: true,
	};
	const fastifyHelmetOptions: FastifyHelmetOptions = {
		contentSecurityPolicy: {
			directives: {
				// For inline worker's blob URL:
				'script-src': ['\'self\'', 'blob:'],
				'worker-src': ['\'self\'', 'blob:'],
			},
		},
	};
	const listenOptions: FastifyListenOptions = {
		host: SBULLASY_APP_HOST!,
		port: Number(SBULLASY_APP_PORT!),
	};
	const routerOptions: IRouterOptions = {
		repositories: {
			userRepository,
			groupRepository,
			pageRepository,
			userTagRepository,
			groupTagRepository,
			pageTagRepository,
			placeRepository,
			subjectRepository,
			subjectCategoryRepository,
			subjectSemesterRepository,
			subjectWeekRepository,
			teacherRepository,
		},
	};
	const instance = fastify(instanceOptions);
	await instance.register(fastifyEtag);
	await instance.register(fastifyHelmet, fastifyHelmetOptions);
	await instance.register(router, routerOptions);

	try {
		await instance.listen(listenOptions);
	} catch (error) {
		instance.log.error(error);
	}

}
