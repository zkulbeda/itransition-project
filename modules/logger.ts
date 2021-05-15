import {
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import {
  createLogger,
  format,
  LeveledLogMethod,
  Logger,
  transports,
} from 'winston';
import { consoleFormat } from 'winston-console-format';
import { AbstractConfigSetLevels } from 'winston/lib/winston/config';

const pinoLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  } as AbstractConfigSetLevels,

  colors: {
    fatal: 'bold white redBG',
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'magenta',
    trace: 'cyan',
  },
};

interface PinoLikeLogger extends Logger {
  fatal: LeveledLogMethod;
  trace: LeveledLogMethod;
}

export const mainLogger: PinoLikeLogger = <PinoLikeLogger>createLogger({
  levels: pinoLevels.levels,
  transports: [],
});

mainLogger.add(new transports.Console({
  format: format.combine(
    format.ms(),
    format.colorize({
      all: true,
      colors: pinoLevels.colors,
    }),
    format.padLevels({ levels: pinoLevels.levels }),
    consoleFormat({
      showMeta: true,
      metaStrip: ['timestamp', 'service', 'requestId', 'reqId'],
      inspectOptions: {
        depth: Infinity,
        colors: true,
        maxArrayLength: 20,
        breakLength: 120,
      },
    }),
  ),
  level: process.env.NODE_ENV === 'development' ? 'trace' : 'error',
}));

declare module 'fastify' {
  // eslint-disable-next-line no-unused-vars
  interface FastifyInstance {
    logger: typeof mainLogger
  }

  // eslint-disable-next-line no-unused-vars,no-shadow
  interface FastifyRequest {
    logger: typeof mainLogger
    reqId: string,
    execTime: DateTime
  }

  // eslint-disable-next-line no-unused-vars
  interface FastifyError {
    validationContext?: string
  }
}

const loggerMiddleware: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('logger', mainLogger);
  fastify.decorateRequest('logger', null);
  fastify.addHook('onRequest', async (request) => {
    request.reqId = nanoid(10);
    request.execTime = DateTime.local();
    request.logger = <PinoLikeLogger>mainLogger.child({ reqId: request.reqId });
    request.logger.info(`${request.method} ${request.routerPath} with id #${request.reqId}`, {
      // @ts-ignore to show without [Object: null prototype]
      query: { ...request.query },
      params: request.params,
    });
  });
  fastify.addHook('onError', async (request, reply, error) => {
    request.logger.fatal(error.message, error);
  });
  fastify.addHook('onResponse', async (request) => {
    request.logger.info(`Request #${request.reqId} done in ${-request.execTime.diffNow()}ms`);
  });
};
export const loggerPlugin = fp(loggerMiddleware, {
  fastify: '3.x',
  name: 'app_logger',
});

export const fastifyPinoFallback = {
  fatal: console.error,
  error: console.error,
  warn: console.error,
  info: console.error,
  debug: console.error,
  trace: console.error,
  child(settings: {
    serializers: {
      req: (req: FastifyRequest) => object,
      res: (res: FastifyReply) => object,
      err: (err: Error) => object
    }
  }) {
    function createChild(childObj: object) {
      function createHandler(func: any) {
        return (logObj: any, description: any) => {
          if (typeof logObj === 'string') {
            return func(logObj);
          }
          const result: any = { ...logObj, ...childObj };
          if (logObj.req) {
            result.req = settings.serializers.req(logObj.req);
          }
          if (logObj.err) {
            result.err = settings.serializers.err(logObj.err);
          }
          if (logObj.res) {
            result.res = settings.serializers.res(logObj.res);
          }
          return func(logObj.msg || description, result);
        };
      }

      return {
        fatal: createHandler(mainLogger.fatal),
        error: createHandler(mainLogger.error),
        warn: createHandler(mainLogger.warn),
        info: createHandler(mainLogger.info),
        debug: createHandler(mainLogger.debug),
        trace: createHandler(mainLogger.trace),
        child: (obj: object) => createChild({ ...childObj, ...obj }),
      };
    }

    return createChild({});
  },
};
