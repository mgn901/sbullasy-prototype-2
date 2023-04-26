import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { RequestExpiredError } from '../error/RequestExpiredError';
import { SbullasyError } from '../error/SbullasyError';
import { SessionInvalidError } from '../error/SessionInvalidError';
import { TokenInvalidError } from '../error/TokenInvalidError';
import { TooManyRequestsError } from '../error/TooManyRequestsError';
import { WrongParamsError } from '../error/WrongParamsError';

export const getStatusByError = (error: SbullasyError) => {
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
