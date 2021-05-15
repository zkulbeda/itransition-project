import ValidationError from './ValidationError';

export default class HeadersValidationError extends ValidationError {
  static type = `${ValidationError.type}/header`;

  constructor(validatorErrors) {
    super('There are some errors in your headers', { validatorErrors });
  }
}
