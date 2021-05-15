import BasicError from '../BasicError';

export default class AutomaticLogOutError extends BasicError {
  static type = `${BasicError.type}/session/logout`;

  static httpStatus = 401;

  constructor(reason) {
    super('You have been logged out', {
      reason,
    });
  }
}
