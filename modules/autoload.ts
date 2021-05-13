/**
 * Edited for using custom structure of modules and custom params structure
 *
 * https://github.com/GiovanniCardamone/fastify-autoroutes
 */
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import path from 'path';
import fs from 'fs';

function isAcceptableFile(file: string, stat: fs.Stats): boolean {
  return (
    !path.basename(file).startsWith('.')
    && !path.basename(file).startsWith('_')
    && !file.endsWith('.map')
    && !file.endsWith('.test.js')
    && !file.endsWith('.test.ts')
    && !file.endsWith('.d.ts')
    && stat.isFile()
  );
}

function replaceParamsToken(token: string) {
  const regex = /\[.+]/g;

  let result;
  let newToken = token;
  do {
    result = regex.exec(newToken);
    if (result == null) break;
    newToken = newToken.substring(0, result.index)
      + result[0].replace('[', ':')
        .replace(']', '')
      + newToken.substr(result.index + result[0].length);
  } while (true);

  return newToken;
}

function pathToUrl(filePath: string) {
  const url = `/${filePath.replace('.ts', '')
    .replace('.js', '')
    .replace('index', '')}`;

  if (url.length === 1) return url;

  return url
    .split(path.sep)
    .map((part) => replaceParamsToken(part))
    .join('/');
}

async function loadModule(modulePath: string) {
  const module = await import(modulePath);

  if (typeof module === 'function') {
    return module;
  }

  if (typeof module === 'object' && 'default' in module) {
    return module.default;
  }

  throw new Error(`Module ${modulePath} has unexpected export`);
}

async function autoload(fastify: FastifyInstance, fullPath: string, url: string) {
  const module = await loadModule(fullPath);

  if (typeof module !== 'function') {
    throw new Error(
      `module ${fullPath} must be valid js/ts module and should export function`,
    );
  }

  module(fastify, url);
}

async function scan(fastify: FastifyInstance, baseDir: string, current: string, injected = []) {
  const combined = path.join(baseDir, current);
  const combinedStat = await fs.promises.stat(combined);

  if (combinedStat.isDirectory()) {
    if (!path.basename(current).startsWith('_')) {
      const files = await fs.promises.readdir(combined);
      await Promise.all(files.map(
        (entry) => scan(fastify, baseDir, path.join(current, entry), injected),
      ));
    }
  } else if (isAcceptableFile(combined, combinedStat)) {
    injected.push(combined);
    await autoload(fastify, combined, pathToUrl(current));
  }
}

export interface FastifyAutoroutesOptions {
  dir: string
}

export default fastifyPlugin<FastifyAutoroutesOptions>(
  async (fastify, options) => {
    if (!options.dir) {
      throw new Error('AutoRoutes dir must be specified');
    }

    if (typeof options.dir !== 'string') {
      throw new Error('AutoRoutes dir must be the path of autoroutes-directory');
    }

    let dirPath: string;

    if (path.isAbsolute(options.dir)) {
      dirPath = options.dir;
    } else {
      throw new Error('AutoRoutes path must be absolute');
    }

    if (!fs.existsSync(dirPath)) {
      throw new Error(`Dir ${dirPath} does not exists`);
    }

    if (!fs.statSync(dirPath)
      .isDirectory()) {
      throw new Error(`Dir ${dirPath} must be a directory`);
    }

    try {
      const injected = [];
      await scan(fastify, dirPath, '', injected);
      fastify.logger.trace('AutoRoute paths are injected: ', injected);
    } catch (error) {
      fastify.logger.warn(error);
      throw error;
    }
  },
  {
    fastify: '>=3.0.0',
    decorators: {
      fastify: ['logger'],
    },
    name: 'fastify-autoroutes',
  },
);
