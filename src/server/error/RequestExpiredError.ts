import { SbullasyError } from './SbullasyError';

export class RequestExpiredError extends SbullasyError {
	public readonly name = 'RequestExpiredError';
}
