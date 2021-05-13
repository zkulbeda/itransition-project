import fastify from 'fastify';
import * as queryString from 'query-string';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@mgcrea/fastify-session';
import dotenv from 'dotenv';
import { SODIUM_SECRETBOX } from '@mgcrea/fastify-session-sodium-crypto';
import path from 'path';
import { fastifyPinoFallback, loggerPlugin, mainLogger } from './modules/logger';
import TypeORMPlugin from './modules/typeorm';
import fastifyAutoRoutes from './modules/autoload';
import NextPlugin from './modules/next';
import errorHandler from './modules/error-handler';
import validationCompiler from './modules/validation-compiler';

dotenv.config();

const app = fastify({
  querystringParser: (str) => queryString.parse(str, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'bracket',
  }),
  pluginTimeout: 20000,
  logger: fastifyPinoFallback,
});
app.register(TypeORMPlugin);
app.register(fastifyCookie);
app.register(fastifySession, {
  secret: process.env.SECRET_COOKIE_PASSWORD,
  crypto: SODIUM_SECRETBOX,
  cookie: {
    maxAge: 864e3, // 1 day in sec
    secure: process.env.NODE_ENV === 'production',
  },
});

app.setErrorHandler(errorHandler);

app.setValidatorCompiler(validationCompiler);

app.register(loggerPlugin);
app.register(fastifyAutoRoutes, {
  dir: path.join(__dirname, './fastify'),
});
app.register(NextPlugin, {
  dir: path.join(process.cwd(), './frontend/main'),
});

app.ready(async (err) => {
  if (err) {
    mainLogger.fatal(err.message, err);
    return;
  }
  await app.listen(+process.env.PORT || 3000);
  console.log('Successful run!', +process.env.PORT || 3000, +process.env.PORT, process.env.PORT);
});
