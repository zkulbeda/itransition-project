import BasicError from '../BasicError';

export default class EmailRegistrationError extends BasicError {
    static type = `${BasicError.type}/registration`

    static httpStatus = 200;
}
