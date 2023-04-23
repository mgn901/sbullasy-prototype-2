import { FastifyInstance } from 'fastify';
import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { RequestExpiredError } from '../error/RequestExpiredError';
import { SbullasyError } from '../error/SbullasyError';
import { SessionInvalidError } from '../error/SessionInvalidError';
import { TokenInvalidError } from '../error/TokenInvalidError';
import { TooManyRequestsError } from '../error/TooManyRequestsError';
import { WrongParamsError } from '../error/WrongParamsError';

export const errorHandler: Parameters<FastifyInstance['setErrorHandler']>[0] = async (error, request, reply) => {
	if (error instanceof NotFoundError) {
		await reply.status(404).send(error);
	} else if (error instanceof PermissionError) {
		await reply.status(403).send(error);
	} else if (error instanceof RequestExpiredError) {
		await reply.status(403).send(error);
	} else if (error instanceof SessionInvalidError) {
		await reply.status(401).send(error);
	} else if (error instanceof TokenInvalidError) {
		await reply.status(401).send(error);
	} else if (error instanceof WrongParamsError) {
		await reply.status(400).send(error);
	} else if (error instanceof TooManyRequestsError) {
		await reply.status(429).send(error);
	} else if (error instanceof SbullasyError) {
		await reply.status(500).send(error);
	} else {
		const response: Error = {
			name: 'UnexpectedInternalError',
			message: 'The server could not process your request.',
		};
		request.server.log.error(error);
		await reply.status(500).send(response);
	}
}
