import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { FastifyError } from 'fastify-error';
import { ZodError } from 'zod';
import BasicError, { IBasicErrorConstructor } from '../errors/BasicError';
import BodyValidationError from '../errors/Validation/BodyValidationError';
import HeadersValidationError from '../errors/Validation/HeadersValidationError';
import ParamsValidationError from '../errors/Validation/ParamsValidationError';
import QueryStringValidationError from '../errors/Validation/QueryStringValidationError';
import ValidationError from '../errors/Validation/ValidationError';
import { mainLogger } from './logger';

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
  if (resultError instanceof BasicError) {
    return reply.code((resultError.constructor as IBasicErrorConstructor).httpStatus)
      .send({
        error: resultError.toObject(),
        success: false,
      });
  }
  request.logger.warn(resultError);
  if (process.env.NODE_ENV === 'development') {
    reply.send(resultError);
  }
  return reply
    .code(500)
    .type('text/plain')
    .send('Internal server error');
};
