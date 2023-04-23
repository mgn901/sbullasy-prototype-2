import { SbullasyError } from './SbullasyError';

export class TooManyRequestsError extends SbullasyError {
	public readonly name = 'TooManyRequestsError';
}
