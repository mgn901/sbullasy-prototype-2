import { FastifyStaticOptions } from '@fastify/static';
import path from 'path';

export const fastifyStaticOptions: FastifyStaticOptions = {
	root: path.join(__dirname, '../', 'client'),
	prefix: '/',
};
