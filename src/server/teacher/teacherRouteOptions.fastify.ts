import { Static, Type } from '@sinclair/typebox';
import { IRepositories } from '../http-api/IRepositories';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { ITeacherCreateInput } from './ITeacherCreateInput';
import { ITeacherDeleteInput } from './ITeacherDeleteInput';
import { ITeacherGetAllInput } from './ITeacherGetAllInput';
import { ITeacherPutInput } from './ITeacherPutInput';
import { teacherCreateInteractor } from './teacherCreateInteractor';
import { teacherDeleteInteractor } from './teacherDeleteInteractor';
import { teacherSchema } from './teacherForPublicSchema';
import { teacherGetAllInteractor } from './teacherGetAllInteractor';
import { teacherPutInteractor } from './teacherPutInteractor';

const teacherIDSchema = Type.Object({
	teacherID: Type.String(),
});

const teacherCreateBodySchema = Type.Object({
	teacher: Type.Omit(teacherSchema, ['id']),
});
const teacherCreateResponseSchema = Type.Object({
	teacher: teacherSchema,
});

const teacherDeleteParamsSchema = teacherIDSchema;

const teacherGetAllResponseSchema = Type.Object({
	teachers: Type.Array(teacherSchema),
});

const teacherPutParamsSchema = teacherIDSchema;
const teacherPutBodySchema = Type.Object({
	teacher: Type.Omit(teacherSchema, ['id']),
});
const teacherPutResponseSchema = Type.Object({
	teacher: teacherSchema,
});

type TTeacherCreateBodySchema = Static<typeof teacherCreateBodySchema>;
type TTeacherCreateResponseSchema = Static<typeof teacherCreateResponseSchema>;
type TTeacherDeleteParamsSchema = Static<typeof teacherDeleteParamsSchema>;
type TTeacherGetAllResponseSchema = Static<typeof teacherGetAllResponseSchema>;
type TTeacherPutParamsSchema = Static<typeof teacherPutParamsSchema>;
type TTeacherPutBodySchema = Static<typeof teacherPutBodySchema>;
type TTeacherPutResponseSchema = Static<typeof teacherPutResponseSchema>;

export const teacherCreateRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Body: TTeacherCreateBodySchema;
	Reply: TTeacherCreateResponseSchema;
}> => ({
	method: 'POST',
	url: '/teachers',
	schema: {
		body: teacherCreateBodySchema,
		response: teacherCreateResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ITeacherCreateInput = {
			teacher: request.body.teacher,
			sessionID: request.cookies.sessionID!,
		};
		const output = await teacherCreateInteractor({
			input: input,
			repository: repositories.teacherRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(201).send(output);
	},
})

export const teacherDeleteRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TTeacherDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/teachers/:teacherID',
	schema: {
		params: teacherDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ITeacherDeleteInput = {
			id: request.params.teacherID,
			sessionID: request.cookies.sessionID!,
		};
		const output = await teacherDeleteInteractor({
			input: input,
			repository: repositories.teacherRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const teacherGetAllRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Reply: TTeacherGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/teachers',
	schema: {
		response: teacherGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ITeacherGetAllInput = {};
		const output = await teacherGetAllInteractor({
			input: input,
			repository: repositories.teacherRepository,
		});
		await reply.status(200).send(output);
	},
})

export const teacherPutRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TTeacherPutParamsSchema;
	Body: TTeacherPutBodySchema;
	Reply: TTeacherPutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/teachers/:teacherID',
	schema: {
		params: teacherPutParamsSchema,
		body: teacherPutBodySchema,
		response: teacherPutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ITeacherPutInput = {
			teacher: {
				id: request.params.teacherID,
				...request.body.teacher,
			},
			sessionID: request.cookies.sessionID!,
		};
		const output = await teacherPutInteractor({
			input: input,
			repository: repositories.teacherRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})
