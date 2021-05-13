import { FastifyInstance } from 'fastify';

export default (app: FastifyInstance, url: string) => {
  app.get<{ Querystring: { test?: string } }>(url, async () => '');
};
