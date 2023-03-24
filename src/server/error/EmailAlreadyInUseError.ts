import { SbullasyError } from './SbullasyError';

export class EmailAlreadyInUseError extends SbullasyError {
	public name = 'AlreadyUsedEmailError';
}
