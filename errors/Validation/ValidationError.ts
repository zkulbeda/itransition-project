import BasicError from '../BasicError';

export default class ValidationError extends BasicError {
    static type = `${BasicError.type}/validation`

    static httpStatus = 400;

    constructor(message, validatorErrors) {
      super(message, { validatorErrors });
    }
}
