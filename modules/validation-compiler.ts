import { ZodTypeAny } from 'zod';
import { FastifySchemaCompiler } from 'fastify';
import { convertNumbersFromObject } from './helpers';
import { mainLogger } from './logger';

interface ZodRequestSchema {
  body?: ZodTypeAny;
  querystring?: ZodTypeAny;
  params?: ZodTypeAny;
  headers?: ZodTypeAny;
  response?: ZodTypeAny;
}

const compiler:FastifySchemaCompiler<ZodRequestSchema> = ({
  schema,
  httpPart,
}) => {
  // @ts-ignore fastify types error
  const RequestSchema: ZodTypeAny = schema;
  return (data) => {
    const convertedData = convertNumbersFromObject(data);
    mainLogger.trace(`Validating ${httpPart}`, convertedData);

    const result = RequestSchema.safeParse(convertedData);
    if (result.success === false) {
      mainLogger.trace('Validation error occurs', result.error.flatten());
      return { error: result.error };
    }
    return { value: result.data };
  };
};

export default compiler;
