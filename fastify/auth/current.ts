import { FastifyInstance } from 'fastify';
import { AuthRequired } from '../../modules/auth';

export default (app: FastifyInstance, url: string) => {
  app.get(url, {
    preHandler: AuthRequired,
  }, async (request) => {
    const { user } = request;
    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        userRole: user.userRole,
      },
    };
  });
};
