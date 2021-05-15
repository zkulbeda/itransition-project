import { FastifyInstance } from 'fastify';

export default (app: FastifyInstance, url: string) => {
  app.get(url, async (req) => req.session);
};
