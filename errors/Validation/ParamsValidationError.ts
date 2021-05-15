import ValidationError from './ValidationError';

export default class ParamsValidationError extends ValidationError {
  static type = `${ValidationError.type}/params`;

  constructor(validatorErrors) {
    super('There are some errors in your url params', { validatorErrors });
  }
}
