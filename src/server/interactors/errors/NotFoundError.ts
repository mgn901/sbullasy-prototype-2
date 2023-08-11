export class NotFoundError extends Error {
  constructor(message = 'The resource you specified is not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}
