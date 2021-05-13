import ValidationError from './ValidationError';

export default class QueryStringValidationError extends ValidationError {
    static type = `${ValidationError.type}/querystring`

    constructor(validatorErrors) {
      super('There are some errors in your query params', { validatorErrors });
    }
}
