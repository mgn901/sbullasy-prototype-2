import { SbullasyError } from './SbullasyError';

export class SessionExpiredError extends SbullasyError {
	public readonly name = 'SessionExpiredError';
}
