import { FastifyInstance } from 'fastify';
import { AuthRequired } from '../../modules/auth';

export default (app: FastifyInstance, url: string) => {
  app.get(url, {
    preHandler: AuthRequired,
  }, async (request) => {
    request.session.user_id = null;
    return { success: true };
  });
};
