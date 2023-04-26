import { FastifyInstance } from 'fastify';
import { SbullasyError } from '../error/SbullasyError';
import { getStatusByError } from './getStatusByError';

export const errorHandler: Parameters<FastifyInstance['setErrorHandler']>[0] = async (error, request, reply) => {
	if (error instanceof SbullasyError) {
		const response = {
			name: error.name,
			message: error.message,
		};
		const statusCode = getStatusByError(error);
		await reply.status(statusCode).send(response);
	} else {
		const response = {
			name: 'UnexpectedInternalError',
			message: 'The server could not process your request.',
		};
		request.server.log.error(error);
		await reply.status(500).send(response);
	}
}
