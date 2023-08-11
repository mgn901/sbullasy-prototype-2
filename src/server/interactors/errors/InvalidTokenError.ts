import { ICheckTokenResult } from '../utils/ICheckTokenResult.ts';

export class InvalidTokenError extends Error {
  public readonly result?: ICheckTokenResult;

  constructor(options: { result?: ICheckTokenResult; message: string }) {
    super(options.message);
    this.name = 'InvalidTokenError';
    this.result = options.result;
  }
}
