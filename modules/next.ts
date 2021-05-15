import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Next from 'next';
import path from 'path';

interface NextPluginOptions {
  dir: string
}

const NextMiddleware: FastifyPluginAsync = async (fastify, options: NextPluginOptions) => {
  const config = await import(path.join(options.dir, 'next.config.js'));
  const next = Next({
    dir: options.dir,
    dev: process.env.NODE_ENV !== 'production' && false,
  });
  const handle = next.getRequestHandler();
  await next.prepare();
  fastify.route({
    url: `${config.basePath ?? ''}*`,
    method: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'],
    async handler(request, reply) {
      reply.hijack();
      await handle(request.raw, reply.raw);
    },
  });
};
const NextPlugin = fp<NextPluginOptions>(NextMiddleware, '3.x');

export default NextPlugin;
