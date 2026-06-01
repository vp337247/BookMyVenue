export class BaseError extends Error {
  constructor(
    public override readonly message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
