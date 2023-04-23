import { Static, Type } from '@sinclair/typebox';
import { IRepositories } from '../http-api/IRepositories';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { IPlaceCreateInput } from './IPlaceCreateInput';
import { IPlaceDeleteInput } from './IPlaceDeleteInput';
import { IPlaceGetAllInput } from './IPlaceGetAllInput';
import { IPlacePutInput } from './IPlacePutInput';
import { placeCreateInteractor } from './placeCreateInteractor';
import { placeDeleteInteractor } from './placeDeleteInteractor';
import { placeGetAllInteractor } from './placeGetAllInteractor';
import { placePutInteractor } from './placePutInteractor';
import { placeSchema } from './placeSchema';

const placeIDSchema = Type.Object({
	placeID: Type.String(),
})

const placeCreateBodySchema = Type.Object({
	place: Type.Omit(placeSchema, ['id']),
});
const placeCreateResponseSchema = Type.Object({
	place: placeSchema,
});

const placeDeleteParamsSchema = placeIDSchema;

const placeGetAllResponseSchema = Type.Object({
	places: Type.Array(placeSchema),
});

const placePutParamsSchema = placeIDSchema;
const placePutBodySchema = Type.Object({
	place: Type.Omit(placeSchema, ['id']),
});
const placePutResponseSchema = Type.Object({
	place: placeSchema,
});

type TPlaceCreateBodySchema = Static<typeof placeCreateBodySchema>;
type TPlaceCreateResponseSchema = Static<typeof placeCreateResponseSchema>;
type TPlaceDeleteParamsSchema = Static<typeof placeDeleteParamsSchema>;
type TPlaceGetAllResponseSchema = Static<typeof placeGetAllResponseSchema>;
type TPlacePutParamsSchema = Static<typeof placePutParamsSchema>;
type TPlacePutBodySchema = Static<typeof placePutBodySchema>;
type TPlacePutResponseSchema = Static<typeof placePutResponseSchema>;

export const placeCreateRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Body: TPlaceCreateBodySchema;
	Reply: TPlaceCreateResponseSchema;
}> => ({
	method: 'POST',
	url: '/places',
	schema: {
		body: placeCreateBodySchema,
		response: placeCreateResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IPlaceCreateInput = {
			place: request.body.place,
			sessionID: request.cookies.sessionID!,
		};
		const output = await placeCreateInteractor({
			input: input,
			repository: repositories.placeRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(201).send(output);
	},
})

export const placeDeleteRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TPlaceDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/places/:placeID',
	schema: {
		params: placeDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: IPlaceDeleteInput = {
			id: request.params.placeID,
			sessionID: request.cookies.sessionID!,
		};
		const output = await placeDeleteInteractor({
			input: input,
			repository: repositories.placeRepository,
			userRepository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const placeGetAllRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Reply: TPlaceGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/places',
	schema: {
		response: placeGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IPlaceGetAllInput = {};
		const output = await placeGetAllInteractor({
			input: input,
			repository: repositories.placeRepository,
		});
		await reply.status(200).send(output);
	},
})

export const placePutRouteOptions = (repositories: IRepositories): TRouteOptionsWrapper<{
	Params: TPlacePutParamsSchema;
	Body: TPlacePutBodySchema;
	Reply: TPlacePutResponseSchema;
}> => ({
	method: 'PUT',
	url: '/places/:placeID',
	schema: {
		params: placePutParamsSchema,
		body: placePutBodySchema,
		response: placePutResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IPlacePutInput = {
			place: {
				id: request.params.placeID,
				...request.body.place,
			},
			sessionID: request.cookies.sessionID!,
		};
		const output = await placePutInteractor({
			input: input,
			repository: repositories.placeRepository,
			userRepository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})
