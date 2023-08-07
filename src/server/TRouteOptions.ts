import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions,
} from 'fastify';

export type TRouteOptions<S extends FastifySchema> = RouteOptions<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
  ContextConfigDefault,
  S,
  JsonSchemaToTsProvider,
  FastifyBaseLogger
>;
