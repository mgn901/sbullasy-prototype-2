import { Server } from 'http';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import { fastifyEtag } from '@fastify/etag';
import { fastifyHelmet, FastifyHelmetOptions } from '@fastify/helmet';
import { config } from 'dotenv';
import fastify, { FastifyHttpOptions, FastifyListenOptions } from 'fastify';
import { httpApiRouter } from './controllers/httpApiRouter.fastify.ts';
import { httpStaticRouter } from './controllers/httpStaticRouter.fastify.ts';
import { EmailClient } from './email-client/EmailCliet.nodemailer.ts';
import { envLoader } from './envLoader.ts';
import { startInteractor } from './interactors/startInteractor.ts';

const { PrismaClient } = await import('./prisma-client');

export const start = async () => {
  config();
  const envDict = envLoader(process.env);

  const repository = new PrismaClient({
    datasources: {
      db: {
        url: envDict.SBULLASY_APP_DB_URL,
      },
    },
  });

  const emailClient = new EmailClient({
    host: envDict.SBULLASY_APP_SMTP_HOST,
    port: Number(envDict.SBULLASY_APP_SMTP_PORT),
    userEmail: envDict.SBULLASY_APP_SMTP_USEREMAIL,
    password: envDict.SBULLASY_APP_SMTP_PASSWORD,
  });

  await startInteractor({
    repository,
    emailClient,
    query: {
      adminUserEmail: envDict.SBULLASY_APP_ADMIN_EMAIL,
    },
  });

  const instanceOptions: FastifyHttpOptions<Server> = {
    logger: true,
  };
  const fastifyCookieOptions: FastifyCookieOptions = {};
  const fastifyHelmetOptions: FastifyHelmetOptions = {
    contentSecurityPolicy: {
      directives: {
        // For inline worker's blob URL:
        'script-src': ["'self'", 'blob:'],
        'worker-src': ["'self'", 'blob:'],
      },
    },
  };
  const listenOptions: FastifyListenOptions = {
    host: envDict.SBULLASY_APP_HOST,
    port: Number(envDict.SBULLASY_APP_PORT),
  };

  const instance = fastify(instanceOptions);
  await instance.register(fastifyEtag);
  await instance.register(fastifyCookie, fastifyCookieOptions);
  await instance.register(fastifyHelmet, fastifyHelmetOptions);
  await instance.register(httpStaticRouter, {
    root: dirname(fileURLToPath(import.meta.url)),
    prefix: '/',
    etag: true,
  });
  await instance.register(httpApiRouter, { repository, emailClient, prefix: '/api/v1' });

  try {
    await instance.listen(listenOptions);
  } catch (error) {
    instance.log.error(error);
  }
};
