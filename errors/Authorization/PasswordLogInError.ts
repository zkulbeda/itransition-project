import BasicError from '../BasicError';

export default class PasswordLogInError extends BasicError {
  static type = `${BasicError.type}/login/password`;

  static httpStatus = 200;
}
