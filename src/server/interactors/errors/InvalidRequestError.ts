export class InvalidRequestError extends Error {
  constructor(message = 'The request secret you sent is invalid.') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}
