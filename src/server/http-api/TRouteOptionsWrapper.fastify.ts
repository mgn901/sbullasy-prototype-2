import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { FastifyBaseLogger, FastifyContextConfig, FastifySchema, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RequestGenericInterface, RouteGenericInterface, RouteOptions } from 'fastify';

export type TRouteOptionsWrapper<R extends RouteGenericInterface> = RouteOptions<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	R,
	FastifyContextConfig,
	FastifySchema,
	TypeBoxTypeProvider,
	FastifyBaseLogger
>;
