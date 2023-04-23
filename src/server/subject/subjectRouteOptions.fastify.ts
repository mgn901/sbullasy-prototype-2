import { Static, Type } from '@fastify/type-provider-typebox';
import { IRepositories } from '../http-api/IRepositories';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { ISubjectDeleteInput } from './ISubjectDeleteInput';
import { ISubjectGetAllInput } from './ISubjectGetAllInput';
import { ISubjectGetInput } from './ISubjectGetInput';
import { ISubjectPutInput } from './ISubjectPutInput';
import { subjectDeleteInteractor } from './subjectDeleteInteractor';
import { subjectForPublicSchema } from './subjectForPublicSchema';
import { subjectGetAllInteractor } from './subjectGetAllInteractor';
import { subjectGetInteractor } from './subjectGetInteractor';
import { subjectPutInteractor } from './subjectPutInteractor';

const subjectIDSchema = Type.Object({
	subjectID: Type.String(),
});

const subjectDeleteParamsSchema = subjectIDSchema;

const subjectGetAllResponseSchema = Type.Object({
	subjects: Type.Array(Type.Omit(subjectForPublicSchema, ['properties'])),
});

const subjectGetParamsSchema = subjectIDSchema;
const subjectGetResponseSchema = Type.Object({
	subject: subjectForPublicSchema,
});

const subjectPutParamsSchema = subjectIDSchema;
const subjectPutBodySchema = Type.Object({
	subject: Type.Object({
		code: Type.String(),
		name: Type.String(),
		nameRuby: Type.String(),
		teachers: Type.Array(Type.String()),
		categories: Type.Array(Type.String()),
		classes: Type.Array(Type.String()),
		grades: Type.Array(Type.Number()),
		semesters: Type.Array(Type.String()),
		weeks: Type.Array(Type.String()),
		places: Type.Array(Type.String()),
		units: Type.Number(),
		properties: Type.Array(propertyWithoutEntityKeySchema),
	}),
});
const subjectPutResponseSchema = Type.Object({
	subject: subjectForPublicSchema,
});

type TSubjectDeleteParamsSchema = Static<typeof subjectDeleteParamsSchema>;
type TSubjectGetAllResponseSchema = Static<typeof subjectGetAllResponseSchema>;
type TSubjectGetParamsSchema = Static<typeof subjectGetParamsSchema>;
type TSubjectGetResponseSchema = Static<typeof subjectGetResponseSchema>;
type TSubjectPutParamsSchema = Static<typeof subjectPutParamsSchema>;
type TSubjectPutBodySchema = Static<typeof subjectPutBodySchema>;
type TSubjectPutResponseSchema = Static<typeof subjectPutResponseSchema>;

export const subjectDeleteRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TSubjectDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/subjects/:subjectID',
	schema: {
		params: subjectDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectDeleteInput = {
			subjectID: request.params.subjectID,
			sessionID: request.cookies.sessionID!,
		};
		const output = await subjectDeleteInteractor({
			input: input,
			repository: repositories.subjectRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const subjectGetAllRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Reply: TSubjectGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/subjects',
	schema: {
		response: { 200: subjectGetAllResponseSchema },
	},
	handler: async (request, reply) => {
		const input: ISubjectGetAllInput = {};
		const output = await subjectGetAllInteractor({
			input: input,
			repository: repositories.subjectRepository,
		});
		await reply.status(200).send(output);
	},
})

export const subjectGetRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TSubjectGetParamsSchema;
	Reply: TSubjectGetResponseSchema;
}> => ({
	method: 'GET',
	url: '/subjects/:subjectID',
	schema: {
		params: subjectGetParamsSchema,
		response: subjectGetResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectGetInput = {
			subjectID: request.params.subjectID,
		};
		const output = await subjectGetInteractor({
			input: input,
			repository: repositories.subjectRepository,
		});
		await reply.status(200).send(output);
	},
})

export const subjectPutRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TSubjectPutParamsSchema;
	Body: TSubjectPutBodySchema;
	Reply: TSubjectPutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/subjects/:subjectID',
	schema: {
		params: subjectPutParamsSchema,
		body: subjectPutBodySchema,
		response: subjectPutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectPutInput = {
			subject: {
				id: request.params.subjectID,
				...request.body.subject,
			},
			sessionID: request.cookies.sessionID!,
		};
		const output = await subjectPutInteractor({
			input: input,
			repository: repositories.subjectRepository,
			...repositories,
		});
		await reply.status(200).send(output);
	},
})
