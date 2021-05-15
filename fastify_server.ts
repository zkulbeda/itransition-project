import fastifySession from '@mgcrea/fastify-session';
import { SODIUM_SECRETBOX } from '@mgcrea/fastify-session-sodium-crypto';
import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyGrant from 'fastify-grant';
import path from 'path';
import * as queryString from 'query-string';
import fastifyAutoRoutes from './modules/autoload';
import errorHandler from './modules/error-handler';
import {
  fastifyPinoFallback,
  loggerPlugin,
  mainLogger,
} from './modules/logger';
import NextPlugin from './modules/next';
import TypeORMPlugin from './modules/typeorm';
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
app.register(fastifyGrant({
  defaults: {
    origin: process.env.API_URL,
    transport: 'session',
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET_KEY,
    callback: '/hello',
    scope: [
      'userinfo.profile',
    ],
  },
}), {
  prefix: '/api',
});
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
  await app.listen(+process.env.PORT || 3000, '0.0.0.0');
  console.log('Successful run!', +process.env.PORT || 3000, +process.env.PORT, process.env.PORT);
});
