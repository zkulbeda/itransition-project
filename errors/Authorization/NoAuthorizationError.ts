import AccessForbiddenError from '../AccessForbiddenError';

export default class NoAuthorizationError extends AccessForbiddenError {
  static type = `${AccessForbiddenError.type}/auth`;

  constructor() {
    super('You must log in');
  }
}
