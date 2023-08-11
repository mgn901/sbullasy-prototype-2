import { FastifyStaticOptions, fastifyStatic } from '@fastify/static';
import { FastifyPluginAsync } from 'fastify';

export const httpStaticRouter: FastifyPluginAsync<FastifyStaticOptions> = async (
  instance,
  options,
) => {
  instance.register(fastifyStatic, options);
};
