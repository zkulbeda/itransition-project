import BasicError from './BasicError';

export default class ServerError extends BasicError {
  static type = '/server-error';

  static httpStatus = 500;

  constructor(message = 'Something went wrong...') {
    super(message);
  }
}
