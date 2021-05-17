import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import User from '../entity/User';
import AutomaticLogOutError from '../errors/Authorization/AutomaticLogOutError';
import NoAuthorizationError from '../errors/Authorization/NoAuthorizationError';
import getPermissionsForUser from './permissions/user';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User | null
  }
}
export async function AuthRequired(request: FastifyRequest) {
  if (!request.user) {
    throw new NoAuthorizationError();
  }
}

const AuthMiddleware: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.decorateRequest('user', null);
  app.addHook('preHandler', async (request) => {
    if (!request.session.user_id) return;
    const user = await request.orm.getRepository(User).findOne(request.session.user_id);
    request.user = user ?? null;

    if (!user) return;

    if (!getPermissionsForUser({ user }).userPermissions.can('login', 'User')) {
      request.session.user_id = null;
      throw new AutomaticLogOutError('You have been blocked');
    }
  });
};

export default fp(AuthMiddleware, {});
