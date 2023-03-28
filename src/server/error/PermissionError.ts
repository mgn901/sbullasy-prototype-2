import { SbullasyError } from './SbullasyError';

export class PermissionError extends SbullasyError {
	public readonly name = 'PermissionError';
}
