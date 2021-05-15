export interface IBasicErrorConstructor {
  type: string,
  httpStatus: number

  // eslint-disable-next-line no-use-before-define
  new(message): BasicError;
}

export default class BasicError extends Error {
  static type = '/errors';

  static httpStatus = 400;

  constructor(message, public extra = undefined) {
    super(message);
  }

  static is(object: Partial<IBasicErrorConstructor>) {
    if (!object.type) return false;
    return object.type.startsWith(this.type);
  }

  toObject() {
    return {
      // @ts-ignore
      type: (this.constructor as IBasicErrorConstructor).type,
      message: this.message,
      extra: this.extra,
    };
  }
}
