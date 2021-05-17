import { FastifyInstance } from 'fastify';

export default (app: FastifyInstance, url: string) => {
  app.get(url, {
    // preHandler: [AuthRequired],
    handler: async (req) => req.session,
  });
};
