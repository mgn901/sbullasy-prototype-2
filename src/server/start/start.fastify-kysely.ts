import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import fastifyEtag from '@fastify/etag';
import fastifyHelmet, { FastifyHelmetOptions } from '@fastify/helmet';
import { fastifyStatic } from '@fastify/static';
import fastify, { FastifyHttpOptions, FastifyListenOptions, FastifyRegisterOptions } from 'fastify';
import { Server } from 'http';
import { createTables } from '../database/createTables.kysely';
import { db } from '../database/db.kysely';
import { EmailClient, IEmailClientOptions } from '../email/EmailClient.nodemailer';
import { envs } from '../env/envs';
import { GroupTagRepository } from '../group-tag/GroupTagRepository.kysely';
import { GroupRepository } from '../group/GroupRepository.kysely';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { IRouterOptions } from "../http-api/IRouterOptions";
import { httpAPIRouter } from '../http-api/httpAPIRouter.fastify';
import { fastifyStaticOptions } from '../http-view/fastifyStaticOptions';
import { httpViewRouter } from '../http-view/httpViewRouter.fastify';
import { PageTagRepository } from '../page-tag/PageTagRepository.kysely';
import { PageRepository } from '../page/PageRepository.kysely';
import { PlaceRepository } from '../place/PlaceRepository.kysely';
import { SettingItemRepository } from '../setting/SettingItemRepository.kysely';
import { SubjectCategoryRepository } from '../subject-category/SubjectCategoryRepository.kysely';
import { SubjectSemesterRepository } from '../subject-semester/SubjectSemesterRepository.kysely';
import { SubjectWeekRepository } from '../subject-week/SubjectWeekRepository.kysely';
import { SubjectRepository } from '../subject/SubjectRepository.kysely';
import { TeacherRepository } from '../teacher/TeacherRepository.kysely';
import { UserTagRepository } from '../user-tag/UserTagRepository.kysely';
import { UserRepository } from '../user/UserRepository.kysely';
import { startInteractor } from './startInteractor';

export const start = async () => {
	await createTables(db);

	const emailClientOptions: IEmailClientOptions = {
		host: envs.SBULLASY_APP_SMTP_HOST,
		port: Number(envs.SBULLASY_APP_SMTP_PORT),
		userEmail: envs.SBULLASY_APP_SMTP_USEREMAIL,
		password: envs.SBULLASY_APP_SMTP_PASSWORD,
	};
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
	const settingItemRepository = new SettingItemRepository();
	const teacherRepository = new TeacherRepository();
	const userTagRepository = new UserTagRepository();
	const emailClient = new EmailClient(emailClientOptions);
	const repositories: IInfrastructures = {
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
		settingItemRepository,
		teacherRepository,
		emailClient,
	};

	await startInteractor({
		input: {
			user: {
				email: envs.SBULLASY_APP_ADMIN_EMAIL,
				displayName: envs.SBULLASY_APP_ADMIN_DISPLAYNAME,
			},
		},
		repository: userRepository,
		userTagRepository: userTagRepository,
	});

	const instanceOptions: FastifyHttpOptions<Server> = {
		logger: true,
	};
	const fastifyCookieOptions: FastifyCookieOptions = {};
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
		host: envs.SBULLASY_APP_HOST,
		port: Number(envs.SBULLASY_APP_PORT),
	};
	const httpAPIRouterOptions: FastifyRegisterOptions<IRouterOptions> = {
		infrastructures: repositories,
		prefix: '/http-api/v1',
	};
	const httpViewRouterOptions: FastifyRegisterOptions<IRouterOptions> = {
		infrastructures: repositories,
	};
	const instance = fastify(instanceOptions);
	await instance.register(fastifyEtag);
	await instance.register(fastifyCookie, fastifyCookieOptions);
	await instance.register(fastifyHelmet, fastifyHelmetOptions);
	await instance.register(fastifyStatic, fastifyStaticOptions);
	await instance.register(httpAPIRouter, httpAPIRouterOptions);
	await instance.register(httpViewRouter, httpViewRouterOptions);

	try {
		await instance.listen(listenOptions);
	} catch (error) {
		instance.log.error(error);
	}

}
