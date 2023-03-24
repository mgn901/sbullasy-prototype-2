import { IErrorParams } from './IErrorParams';

export class SbullasyError extends Error {
	public readonly message: string;
	public readonly name: string = 'SbullasyError';
	public readonly originalError: Error | undefined;

	public constructor(param: IErrorParams) {
		const message = param.message;
		super(message);
		this.message = message ?? '';
		this.originalError = param.originalError;
	}
}
