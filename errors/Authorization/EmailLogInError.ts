import BasicError from '../BasicError';

export default class EmailLogInError extends BasicError {
    static type = `${BasicError.type}/login/email`

    static httpStatus = 200;
}
