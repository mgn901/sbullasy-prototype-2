import { Static, Type } from '@fastify/type-provider-typebox';
import { groupForPublicSchema } from '../group/groupForPublicSchema';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { pageForPublicSchema } from '../page/pageForPublicSchema';
import { propertyWithoutEntityKeySchema } from '../property/propertyWithoutEntityKeySchema';
import { sessionForPublicSchema } from '../session/sessionForPublicSchema';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateInput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateInput';
import { IUserDeleteInput } from './IUserDeleteInput';
import { IUserEditInput } from './IUserEditInput';
import { IUserMeGetInput } from './IUserMeGetInput';
import { IUserSessionsCreateInput } from './IUserSessionsCreateInput';
import { IUserSessionsDeleteAllInput } from './IUserSessionsDeleteAllInput';
import { IUserSessionsDeleteCurrentInput } from './IUserSessionsDeleteCurrentInput';
import { IUserSessionsDeleteInput } from './IUserSessionsDeleteInput';
import { IUserSessionsGetAllInput } from './IUserSessionsGetAllInput';
import { userCreateIfNotExistsAndCreateSessionRequestCreateInteractor } from './userCreateIfNotExistsAndCreateSessionRequestCreateInteractor';
import { userDeleteInteractor } from './userDeleteInteractor';
import { userEditInteractor } from './userEditInteractor';
import { userMeGetInteractor } from './userMeGetInteractor';
import { userSessionsCreateInteractor } from './userSessionsCreateInteractor';
import { userSessionsDeleteAllInteractor } from './userSessionsDeleteAllInteractor';
import { userSessionsDeleteCurrentInteractor } from './userSessionsDeleteCurrentInteractor';
import { userSessionsDeleteInteractor } from './userSessionsDeleteInteractor';
import { userSessionsGetAllInteractor } from './userSessionsGetAllInteractor';
import { userTagWithExpiresAtSchema } from './userTagWithExpiresAtSchema';

const userIDParamsSchema = Type.Object({
	userID: Type.String(),
});

const userCreateIfNotExistsAndCreateSessionRequestCreateBodySchema = Type.Object({
	user: Type.Object({
		email: Type.String(),
	}),
});

const userDeleteParamsSchema = userIDParamsSchema;

const userEditParamsSchema = userIDParamsSchema;
const userEditBodySchema = Type.Object({
	user: Type.Object({
		displayName: Type.String(),
		properties: Type.Array(propertyWithoutEntityKeySchema),
	}),
});
const userEditResponseSchema = Type.Object({
	user: Type.Object({
		id: Type.String(),
		email: Type.String(),
		displayName: Type.String(),
		tags: Type.Array(userTagWithExpiresAtSchema),
		properties: Type.Array(propertyWithoutEntityKeySchema),
	}),
});

const userEmailChangeParamsSchema = userIDParamsSchema;
const userEmailChangeBodySchema = Type.Object({
	email: Type.String(),
});

const userMeGetResponseSchema = Type.Object({
	user: Type.Object({
		id: Type.String(),
		email: Type.String(),
		displayName: Type.String(),
		owns: Type.Array(groupForPublicSchema),
		belongs: Type.Array(groupForPublicSchema),
		tags: Type.Array(userTagWithExpiresAtSchema),
		properties: Type.Array(propertyWithoutEntityKeySchema),
	}),
});

const userPagesGetParamsSchema = userIDParamsSchema;
const userPagesGetResponseSchema = Type.Object({
	pages: Type.Array(pageForPublicSchema),
});

const userSessionsCreateBodySchema = Type.Object({
	email: Type.String(),
	createSessionRequestToken: Type.String(),
});

const userSessionsDeleteAllParamsSchema = userIDParamsSchema;

const userSessionsDeleteParamsSchema = Type.Object({
	userID: Type.String(),
	sessionName: Type.String(),
});

const userSessionsGetAllParamsSchema = userIDParamsSchema;
const userSessionsGetAllResponseSchema = Type.Object({
	sessions: Type.Array(sessionForPublicSchema),
});

const userTagsDeleteParamsSchema = userIDParamsSchema;

const userTagsPutParamsSchema = Type.Object({
	userID: Type.String(),
	tagID: Type.String(),
});
const userTagsPutBodySchema = Type.Object({
	reason: Type.Optional(Type.String()),
	requestToken: Type.Optional(Type.String()),
});

const userWatchesGroupsDeleteParamsSchema = Type.Object({
	userID: Type.String(),
	groupID: Type.String(),
});

const userWatchesGroupsGetParamsSchema = userIDParamsSchema;
const userWatchesGroupsGetResponseSchema = Type.Object({
	watchesGroups: Type.Array(groupForPublicSchema),
});

const userWatchesGroupsPutParamsSchema = Type.Object({
	userID: Type.String(),
	groupID: Type.String(),
});

const userWatchesPagesDeleteParamsSchema = Type.Object({
	userID: Type.String(),
	pageID: Type.String(),
});

const userWatchesPagesGetParamsSchema = userIDParamsSchema;
const userWatchesPagesGetResponseSchema = Type.Object({
	watchesPages: Type.Array(pageForPublicSchema),
});

const userWatchesPagesPutParamsSchema = Type.Object({
	userID: Type.String(),
	pageID: Type.String(),
});

type TUserCreateIfNotExistsAndCreateSessionRequestCreateBodySchema = Static<typeof userCreateIfNotExistsAndCreateSessionRequestCreateBodySchema>;
type TUserDeleteParamsSchema = Static<typeof userDeleteParamsSchema>;
type TUserEditParamsSchema = Static<typeof userEditParamsSchema>;
type TUserEditBodySchema = Static<typeof userEditBodySchema>;
type TUserEditResponseSchema = Static<typeof userEditResponseSchema>;
type TUserEmailChangeParamsSchema = Static<typeof userEmailChangeParamsSchema>;
type TUserEmailChangeBodySchema = Static<typeof userEmailChangeBodySchema>;
type TUserMeGetResponseSchema = Static<typeof userMeGetResponseSchema>;
type TUserPagesGetParamsSchema = Static<typeof userPagesGetParamsSchema>;
type TUserPagesGetResponseSchema = Static<typeof userPagesGetResponseSchema>;
type TUserSessionsCreateBodySchema = Static<typeof userSessionsCreateBodySchema>;
type TUserSessionsDeleteAllParamsSchema = Static<typeof userSessionsDeleteAllParamsSchema>;
type TUserSessionsDeleteParamsSchema = Static<typeof userSessionsDeleteParamsSchema>;
type TUserSessionsGetAllParamsSchema = Static<typeof userSessionsGetAllParamsSchema>;
type TUserSessionsGetAllResponseSchema = Static<typeof userSessionsGetAllResponseSchema>;
type TUserTagsDeleteParamsSchema = Static<typeof userTagsDeleteParamsSchema>;
type TUserTagsPutParamsSchema = Static<typeof userTagsPutParamsSchema>;
type TUserTagsPutBodySchema = Static<typeof userTagsPutBodySchema>;
type TUserWatchesGroupsDeleteParamsSchema = Static<typeof userWatchesGroupsDeleteParamsSchema>;
type TUserWatchesGroupsGetParamsSchema = Static<typeof userWatchesGroupsGetParamsSchema>;
type TUserWatchesGroupsGetResponseSchema = Static<typeof userWatchesGroupsGetResponseSchema>;
type TUserWatchesGroupsPutParamsSchema = Static<typeof userWatchesGroupsPutParamsSchema>;
type TUserWatchesPagesDeleteParamsSchema = Static<typeof userWatchesPagesDeleteParamsSchema>;
type TUserWatchesPagesGetParamsSchema = Static<typeof userWatchesPagesGetParamsSchema>;
type TUserWatchesPagesGetResponseSchema = Static<typeof userWatchesPagesGetResponseSchema>;
type TUserWatchesPagesPutParamsSchema = Static<typeof userWatchesPagesPutParamsSchema>;

export const userCreateIfNotExistsAndCreateSessionRequestCreateRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Body: TUserCreateIfNotExistsAndCreateSessionRequestCreateBodySchema;
}> => ({
	method: 'POST',
	url: '/users/me/create-session-requests',
	schema: {
		body: userCreateIfNotExistsAndCreateSessionRequestCreateBodySchema,
	},
	handler: async (request, reply) => {
		const input: IUserCreateIfNotExistsAndCreateSessionRequestCreateInput = {
			user: {
				email: request.body.user.email,
				ipAddress: request.ip,
			},
		};
		const output = await userCreateIfNotExistsAndCreateSessionRequestCreateInteractor({
			input: input,
			repository: repositories.userRepository,
			emailClient: repositories.emailClient,
			settingItemRepository: repositories.settingItemRepository,
		});
		await (async o => reply.status(204).send())(output);
	},
})

export const userDeleteRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TUserDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/users/:userID',
	schema: {
		params: userDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: IUserDeleteInput = {
			sessionID: request.cookies.sessionID!,
			userID: request.params.userID,
		};
		const output = await userDeleteInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})

export const userEditRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TUserEditParamsSchema;
	Body: TUserEditBodySchema;
	Reply: TUserEditResponseSchema;
}> => ({
	method: 'PUT',
	url: '/users/:userID',
	schema: {
		params: userEditParamsSchema,
		body: userEditBodySchema,
		response: userEditResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IUserEditInput = {
			sessionID: request.cookies.sessionID!,
			user: {
				id: request.params.userID,
				...request.body.user,
			},
		};
		const output = await userEditInteractor({
			input: input,
			repository: repositories.userRepository,
			groupRepository: repositories.groupRepository,
			pageRepository: repositories.pageRepository,
		});
		await reply.status(200).send(output);
	},
})

export const userMeGetRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Reply: TUserMeGetResponseSchema;
}> => ({
	method: 'GET',
	url: '/users/me',
	schema: {
		response: userMeGetResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IUserMeGetInput = {
			sessionID: request.cookies.sessionID!,
		};
		const output = await userMeGetInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})

export const userSessionsCreateRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Body: TUserSessionsCreateBodySchema;
}> => ({
	method: 'POST',
	url: '/users/me/sessions',
	schema: {
		body: userSessionsCreateBodySchema,
	},
	handler: async (request, reply) => {
		const input: IUserSessionsCreateInput = {
			ipAddress: request.ip,
			...request.body,
		};
		const output = await userSessionsCreateInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		await reply
			.setCookie('sessionID', output.sessionID, {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 5 * 365 * 24 * 60 * 60,
				secure: true,
				signed: false,
			})
			.status(204)
			.send();
	},
})

export const userSessionsDeleteAllRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TUserSessionsDeleteAllParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/users/:userID/sessions',
	schema: {
		params: userSessionsDeleteAllParamsSchema,
	},
	handler: async (request, reply) => {
		const input: IUserSessionsDeleteAllInput = {
			userID: request.params.userID,
			sessionID: request.cookies.sessionID!,
		};
		const output = await userSessionsDeleteAllInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		// TODO: Cookieのオプション
		await (async o => await reply
			.clearCookie('sessionID', {
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			})
			.status(204)
			.send())(output);
	},
})

export const userSessionsDeleteCurrentRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{}> => ({
	method: 'DELETE',
	url: '/users/:userID/sessions/current',
	handler: async (request, reply) => {
		const input: IUserSessionsDeleteCurrentInput = {
			sessionID: request.cookies.sessionID!,
		};
		const output = await userSessionsDeleteCurrentInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		// TODO: Cookieのオプション
		await (async o => await reply
			.clearCookie('sessionID', {
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
			})
			.status(204)
			.send())(output);
	},
})

export const userSessionDeleteRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TUserSessionsDeleteParamsSchema;
}> => ({
	method: 'DELETE',
	url: '/users/:userID/sessions/:sessionName',
	schema: {
		params: userSessionsDeleteParamsSchema,
	},
	handler: async (request, reply) => {
		const input: IUserSessionsDeleteInput = {
			sessionID: request.cookies.sessionID!,
			userID: request.params.userID,
			sessionName: request.params.sessionName,
		};
		const output = await userSessionsDeleteInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		await (async o => await reply.status(204).send())(output);
	},
})

export const userSessionsGetAllRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TUserSessionsGetAllParamsSchema;
	Reply: TUserSessionsGetAllResponseSchema;
}> => ({
	method: 'GET',
	url: '/users/:userID/sessions',
	schema: {
		params: userSessionsGetAllParamsSchema,
		response: userSessionsGetAllResponseSchema,
	},
	handler: async (request, reply) => {
		const input: IUserSessionsGetAllInput = {
			sessionID: request.cookies.sessionID!,
			userID: request.params.userID,
		};
		const output = await userSessionsGetAllInteractor({
			input: input,
			repository: repositories.userRepository,
		});
		await reply.status(200).send(output);
	},
})
