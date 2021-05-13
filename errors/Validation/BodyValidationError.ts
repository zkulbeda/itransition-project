import ValidationError from './ValidationError';

export default class BodyValidationError extends ValidationError {
    static type = `${ValidationError.type}/body`

    constructor(validatorErrors) {
      super('There are some errors in your body', { validatorErrors });
    }
}
