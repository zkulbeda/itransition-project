import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Connection } from 'typeorm';
import getBDInstance from './database';

declare module 'fastify' {
  interface FastifyRequest {
    orm: Connection
  }
}

const TypeORMMiddleware: FastifyPluginAsync = async (fastify) => {
  const db = await getBDInstance();
  fastify.decorateRequest('orm', null);
  fastify.addHook('onRequest', async (request) => {
    request.orm = db;
  });
};
export default fp(TypeORMMiddleware, '3.x');
