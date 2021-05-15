import BasicError from './BasicError';

export default class ObjectNotFoundError extends BasicError {
  static type = `${BasicError.type}/object/not-found`;

  static httpStatus = 404;

  constructor(object = 'object') {
    super(`Can't find such a ${object}`, { object });
  }
}
