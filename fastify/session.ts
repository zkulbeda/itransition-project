import { FastifyInstance } from 'fastify';
import { AuthRequired } from '../modules/auth';

export default (app: FastifyInstance, url: string) => {
  app.get(url, {
    preHandler: [AuthRequired],
    handler: async (req) => req.session,
  });
};
