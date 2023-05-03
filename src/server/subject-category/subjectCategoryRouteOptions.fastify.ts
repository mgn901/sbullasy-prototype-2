import { Static, Type } from '@fastify/type-provider-typebox';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { ISubjectCategoryCreateInput } from './ISubjectCategoryCreateInput';
import { ISubjectCategoryDeleteInput } from './ISubjectCategoryDeleteInput';
import { ISubjectCategoryGetAllInput } from './ISubjectCategoryGetAllInput';
import { ISubjectCategoryPutInput } from './ISubjectCategoryPutInput';
import { subjectCategoryCreateInteractor } from './subjectCategoryCreateInteractor';
import { subjectCategoryDeleteInteractor } from './subjectCategoryDeleteInteractor';
import { subjectCategoryGetAllInteractor } from './subjectCategoryGetAllInteractor';
import { subjectCategoryPutInteractor } from './subjectCategoryPutInteractor';
import { subjectCategorySchema } from './subjectCategorySchema';

const subjectCategoryIDSchema = Type.Object({
	subjectCategoryID: Type.String(),
});

const subjectCategoryCreateBodySchema = Type.Object({
	subjectCategory: Type.Omit(subjectCategorySchema, ['id']),
});
const subjectCategoryCreateResponseSchema = Type.Object({
	subjectCategory: subjectCategorySchema,
});

const subjectCategoryDeleteParamsSchema = subjectCategoryIDSchema;

const subjectCategoryGetAllResponseSchema = Type.Object({
	subjectCategories: Type.Array(subjectCategorySchema),
});

const subjectCategoryPutParamsSchema = subjectCategoryIDSchema;
const subjectCategoryPutBodySchema = Type.Object({
	subjectCategory: Type.Omit(subjectCategorySchema, ['id']),
});
const subjectCategoryPutResponseSchema = Type.Object({
	subjectCategory: subjectCategorySchema,
});

type TSubjectCategoryCreateBodySchema = Static<typeof subjectCategoryCreateBodySchema>;
type TSubjectCategoryCreateResponseSchema = Static<typeof subjectCategoryCreateResponseSchema>;
type TSubjectCategoryDeleteParamsSchema = Static<typeof subjectCategoryDeleteParamsSchema>;
type TSubjectCategoryGetAllResponseSchema = Static<typeof subjectCategoryGetAllResponseSchema>;
type TSubjectCategoryPutParamsSchema = Static<typeof subjectCategoryPutParamsSchema>;
type TSubjectCategoryPutBodySchema = Static<typeof subjectCategoryPutBodySchema>;
type TSubjectCategoryPutResponseSchema = Static<typeof subjectCategoryPutResponseSchema>;

export const subjectCategoryCreateRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Body: TSubjectCategoryCreateBodySchema;
	Reply: TSubjectCategoryCreateResponseSchema;
}> => ({
	method: 'POST',
	url: '/subject-categories',
	schema: {
		body: subjectCategoryCreateBodySchema,
		response: subjectCategoryCreateResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectCategoryCreateInput = {
			sessionID: request.cookies.sessionID!,
			subjectCategory: request.body.subjectCategory,
		};
		const output = await subjectCategoryCreateInteractor({
			input: input,
			repository: repositories.subjectCategoryRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(201).send(output);
	},
})

export const subjectCategoryDeleteRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectCategoryDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/subject-categories/:subjectCategoryID',
	schema: {
		body: subjectCategoryDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectCategoryDeleteInput = {
			sessionID: request.cookies.sessionID,
			id: request.params.subjectCategoryID,
		};
		const output = await subjectCategoryDeleteInteractor({
			input: input,
			repository: repositories.subjectCategoryRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const subjectCategoryGetAllRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Reply: TSubjectCategoryGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/subject-categories',
	schema: {
		response: subjectCategoryGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectCategoryGetAllInput = {};
		const output = await subjectCategoryGetAllInteractor({
			input: input,
			repository: repositories.subjectCategoryRepository,
		});
		await reply.status(200).send(output);
	},
})

export const subjectCategoryPutRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectCategoryPutParamsSchema;
	Body: TSubjectCategoryPutBodySchema;
	Reply: TSubjectCategoryPutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/subject-categories/:subjectCategoryID',
	schema: {
		params: subjectCategoryPutParamsSchema,
		body: subjectCategoryPutBodySchema,
		response: subjectCategoryPutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectCategoryPutInput = {
			sessionID: request.cookies.sessionID!,
			subjectCategory: {
				id: request.params.subjectCategoryID,
				...request.body.subjectCategory,
			},
		};
		const output = await subjectCategoryPutInteractor({
			input: input,
			repository: repositories.subjectCategoryRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})
