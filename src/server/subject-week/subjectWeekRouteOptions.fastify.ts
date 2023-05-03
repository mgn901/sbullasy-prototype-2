import { Static, Type } from '@sinclair/typebox';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { ISubjectWeekCreateInput } from './ISubjectWeekCreateInput';
import { ISubjectWeekDeleteInput } from './ISubjectWeekDeleteInput';
import { ISubjectWeekGetAllInput } from './ISubjectWeekGetAllInput';
import { ISubjectWeekPutInput } from './ISubjectWeekPutInput';
import { subjectWeekCreateInteractor } from './subjectWeekCreateInteractor';
import { subjectWeekDeleteInteractor } from './subjectWeekDeleteInteractor';
import { subjectWeekGetAllInteractor } from './subjectWeekGetAllInteractor';
import { subjectWeekPutInteractor } from './subjectWeekPutInteractor';
import { subjectWeekSchema } from './subjectWeekSchema';

const subjectWeekIDSchema = Type.Object({
	subjectWeekID: Type.String(),
});

const subjectWeekCreateBodySchema = Type.Object({
	subjectWeek: Type.Omit(subjectWeekSchema, ['id']),
});
const subjectWeekCreateResponseSchema = Type.Object({
	subjectWeek: subjectWeekSchema,
});

const subjectWeekDeleteParamsSchema = subjectWeekIDSchema;

const subjectWeekGetAllResponseSchema = Type.Object({
	subjectWeeks: Type.Array(subjectWeekSchema),
});

const subjectWeekPutParamsSchema = subjectWeekIDSchema;
const subjectWeekPutBodySchema = Type.Object({
	subjectWeek: Type.Omit(subjectWeekSchema, ['id']),
});
const subjectWeekPutResponseSchema = Type.Object({
	subjectWeek: subjectWeekSchema,
});

type TSubjectWeekCreateBodySchema = Static<typeof subjectWeekCreateBodySchema>;
type TSubjectWeekCreateResponseSchema = Static<typeof subjectWeekCreateResponseSchema>;
type TSubjectWeekDeleteParamsSchema = Static<typeof subjectWeekDeleteParamsSchema>;
type TSubjectWeekGetAllResponseSchema = Static<typeof subjectWeekGetAllResponseSchema>;
type TSubjectWeekPutParamsSchema = Static<typeof subjectWeekPutParamsSchema>;
type TSubjectWeekPutBodySchema = Static<typeof subjectWeekPutBodySchema>;
type TSubjectWeekPutResponseSchema = Static<typeof subjectWeekPutResponseSchema>;

export const subjectWeekCreateRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Body: TSubjectWeekCreateBodySchema;
	Reply: TSubjectWeekCreateResponseSchema;
}> => ({
	method: 'POST',
	url: '/subject-weeks',
	schema: {
		body: subjectWeekCreateBodySchema,
		response: subjectWeekCreateResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectWeekCreateInput = {
			subjectWeek: request.body.subjectWeek,
			sessionID: request.cookies.sessionID!,
		};
		const output = await subjectWeekCreateInteractor({
			input: input,
			repository: repositories.subjectWeekRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(201).send(output);
	},
})

export const subjectWeekDeleteRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectWeekDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/subject-weeks/:subjectWeekID',
	schema: {
		params: subjectWeekDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectWeekDeleteInput = {
			id: request.params.subjectWeekID,
			sessionID: request.cookies.sessionID!,
		};
		const output = await subjectWeekDeleteInteractor({
			input: input,
			repository: repositories.subjectWeekRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const subjectWeekGetAllRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Reply: TSubjectWeekGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/subject-weeks',
	schema: {
		response: subjectWeekGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectWeekGetAllInput = {};
		const output = await subjectWeekGetAllInteractor({
			input: input,
			repository: repositories.subjectWeekRepository,
		});
		await reply.status(200).send(output);
	},
})

export const subjectWeekPutRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectWeekPutParamsSchema;
	Body: TSubjectWeekPutBodySchema;
	Reply: TSubjectWeekPutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/subject-week/:subjectWeekID',
	schema: {
		params: subjectWeekPutParamsSchema,
		body: subjectWeekPutBodySchema,
		response: subjectWeekPutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectWeekPutInput = {
			subjectWeek: {
				id: request.params.subjectWeekID,
				...request.body.subjectWeek,
			},
			sessionID: request.cookies.sessionID!,
		};
		const output = await subjectWeekPutInteractor({
			input: input,
			repository: repositories.subjectWeekRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	}
})
