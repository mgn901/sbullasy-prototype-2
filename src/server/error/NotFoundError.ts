import { SbullasyError } from './SbullasyError';

export class NotFoundError extends SbullasyError {
	public readonly name = 'NotFoundError';
}
