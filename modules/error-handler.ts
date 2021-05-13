import { ZodError } from 'zod';
import { FastifyError } from 'fastify-error';
import { FastifyReply, FastifyRequest } from 'fastify';
import BasicError, { IBasicErrorConstructor } from '../errors/BasicError';
import { mainLogger } from './logger';
import BodyValidationError from '../errors/Validation/BodyValidationError';
import QueryStringValidationError from '../errors/Validation/QueryStringValidationError';
import ParamsValidationError from '../errors/Validation/ParamsValidationError';
import HeadersValidationError from '../errors/Validation/HeadersValidationError';
import ValidationError from '../errors/Validation/ValidationError';

type ZodErrorWithContext = ZodError & { validationContext: string }
type SomeError = Error | BasicError | ZodErrorWithContext | FastifyError

export default (error: SomeError, request: FastifyRequest, reply: FastifyReply) => {
  let resultError = error;

  if (resultError instanceof ZodError) {
    mainLogger.trace('Making ZodError basic-like');
    switch (resultError.validationContext) {
      case 'body':
        resultError = new BodyValidationError(resultError.errors);
        break;
      case 'querystring':
        resultError = new QueryStringValidationError(resultError.errors);
        break;
      case 'params':
        resultError = new ParamsValidationError(resultError.errors);
        break;
      case 'headers':
        resultError = new HeadersValidationError(resultError.errors);
        break;
      default:
        resultError = new ValidationError('Undefined error', resultError.errors);
    }
  }
  if (error instanceof BasicError) {
    return reply.code((error.constructor as IBasicErrorConstructor).httpStatus)
      .send({
        error: error.toObject(),
        success: false,
      });
  }
  request.logger.warn(error);
  if (process.env.NODE_ENV === 'development') {
    reply.send(error);
  }
  return reply
    .code(500)
    .type('text/plain')
    .send('Internal server error');
};
