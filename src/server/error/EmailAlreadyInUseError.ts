import { SbullasyError } from './SbullasyError';

export class EmailAlreadyInUseError extends SbullasyError {
	public readonly name = 'AlreadyUsedEmailError';
}
