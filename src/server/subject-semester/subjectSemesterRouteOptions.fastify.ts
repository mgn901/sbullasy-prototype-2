import { Static, Type } from '@sinclair/typebox';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { ISubjectSemesterCreateInput } from './ISubjectSemesterCreateInput';
import { ISubjectSemesterDeleteInput } from './ISubjectSemesterDeleteInput';
import { ISubjectSemesterGetAllInput } from './ISubjectSemesterGetAllInput';
import { ISubjectSemesterPutInput } from './ISubjectSemesterPutInput';
import { subjectSemesterCreateInteractor } from './subjectSemesterCreateInteractor';
import { subjectSemesterDeleteInteractor } from './subjectSemesterDeleteInteractor';
import { subjectSemesterGetAllInteractor } from './subjectSemesterGetAllInteractor';
import { subjectSemesterPutInteractor } from './subjectSemesterPutInteractor';
import { subjectSemesterSchema } from './subjectSemesterSchema';

const subjectIDSchema = Type.Object({
	subjectID: Type.String(),
});

const subjectSemesterCreateBodySchema = Type.Object({
	subjectSemester: Type.Omit(subjectSemesterSchema, ['id']),
});
const subjectSemesterCreateResponseSchema = Type.Object({
	subjectSemester: subjectSemesterSchema,
});

const subjectSemesterDeleteParamsSchema = subjectIDSchema;

const subjectSemesterGetAllResponseSchema = Type.Object({
	subjectSemesters: Type.Array(subjectSemesterSchema),
});

const subjectSemesterPutParamsSchema = subjectIDSchema;
const subjectSemesterPutBodySchema = Type.Object({
	subjectSemester: Type.Omit(subjectSemesterSchema, ['id']),
});
const subjectSemesterPutResponseSchema = Type.Object({
	subjectSemester: subjectSemesterSchema,
});

type TSubjectSemesterCreateBodySchema = Static<typeof subjectSemesterCreateBodySchema>;
type TSubjectSemesterCreateResponseSchema = Static<typeof subjectSemesterCreateResponseSchema>;
type TSubjectSemesterDeleteParamsSchema = Static<typeof subjectSemesterDeleteParamsSchema>;
type TSubjectSemesterGetAllResponseSchema = Static<typeof subjectSemesterGetAllResponseSchema>;
type TSubjectSemesterPutParamsSchema = Static<typeof subjectSemesterPutParamsSchema>;
type TSubjectSemesterPutBodySchema = Static<typeof subjectSemesterPutBodySchema>;
type TSubjectSemesterPutResponseSchema = Static<typeof subjectSemesterPutResponseSchema>;

export const subjectSemesterCreateRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Body: TSubjectSemesterCreateBodySchema;
	Reply: TSubjectSemesterCreateResponseSchema;
}> => ({
	method: 'POST',
	url: '/subject-semesters',
	schema: {
		body: subjectSemesterCreateBodySchema,
		response: subjectSemesterCreateResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectSemesterCreateInput = {
			sessionID: request.cookies.sessionID!,
			subjectSemester: request.body.subjectSemester,
		};
		const output = await subjectSemesterCreateInteractor({
			input: input,
			repository: repositories.subjectSemesterRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(201).send(output);
	},
})

export const subjectSemesterDeleteRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectSemesterDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/subject-semesters/:subjectSemesterID',
	schema: {
		params: subjectSemesterDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectSemesterDeleteInput = {
			sessionID: request.cookies.sessionID!,
			id: request.params.subjectID,
		};
		const output = await subjectSemesterDeleteInteractor({
			input: input,
			repository: repositories.subjectSemesterRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const subjectSemesterGetAllRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Reply: TSubjectSemesterGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/subject-semesters',
	schema: {
		response: subjectSemesterGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectSemesterGetAllInput = {};
		const output = await subjectSemesterGetAllInteractor({
			input: input,
			repository: repositories.subjectSemesterRepository,
		});
		await reply.status(200).send(output);
	},
})

export const subjectSemesterPutRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectSemesterPutParamsSchema;
	Body: TSubjectSemesterPutBodySchema;
	Reply: TSubjectSemesterPutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/subject-semesters/:subjectSemesterID',
	schema: {
		params: subjectSemesterPutParamsSchema,
		body: subjectSemesterPutBodySchema,
		response: subjectSemesterPutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectSemesterPutInput = {
			sessionID: request.cookies.sessionID!,
			subjectSemester: {
				id: request.params.subjectID,
				...request.body.subjectSemester,
			},
		};
		const output = await subjectSemesterPutInteractor({
			input: input,
			repository: repositories.subjectSemesterRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})
