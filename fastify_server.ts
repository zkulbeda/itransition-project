import dotenv from 'dotenv';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyGrant from 'fastify-grant';
import fastifySession from 'fastify-session';
import Redis from 'ioredis';
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
import RedisSessionStore from './modules/redis-store';
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

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

app.register(fastifySession, {
  secret: process.env.SECRET_COOKIE_PASSWORD,
  store: new RedisSessionStore(redisClient),
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
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    response: ['token', 'profile'],
  },
  vk: {
    key: process.env.VK_CLIENT_ID,
    secret: process.env.VK_SECRET_KEY,
    callback: '/hello',
    scope: [
      'email',
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
