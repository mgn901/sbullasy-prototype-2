import { FastifyInstance } from 'fastify';
import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { RequestExpiredError } from '../error/RequestExpiredError';
import { SbullasyError } from '../error/SbullasyError';
import { SessionInvalidError } from '../error/SessionInvalidError';
import { TokenInvalidError } from '../error/TokenInvalidError';
import { TooManyRequestsError } from '../error/TooManyRequestsError';
import { WrongParamsError } from '../error/WrongParamsError';

const getStatusByError = (error: SbullasyError) => {
	if (error instanceof NotFoundError)
		return 404;
	else if (error instanceof PermissionError)
		return 403;
	else if (error instanceof RequestExpiredError)
		return 403;
	else if (error instanceof SessionInvalidError)
		return 401;
	else if (error instanceof TokenInvalidError)
		return 401;
	else if (error instanceof WrongParamsError)
		return 400;
	else if (error instanceof TooManyRequestsError)
		return 429;
	else
		return 500;
}

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
