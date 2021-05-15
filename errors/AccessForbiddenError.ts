import BasicError from './BasicError';

export default class AccessForbiddenError extends BasicError {
  static type = `${BasicError.type}/access-forbidden`;

  constructor(reason) {
    super('You can\'t get access to this', { reason });
  }
}
