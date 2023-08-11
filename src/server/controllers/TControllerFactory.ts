import { FastifySchema } from 'fastify';
import { TRouteOptions } from './TRouteOptions.ts';
import { IRepository } from '../repositories/IRepository.ts';
import { IEmailClient } from '../email-client/IEmailClient.ts';

export type TControllerFactory<T extends FastifySchema> = (options: {
  repository: IRepository;
  emailClient: IEmailClient;
}) => TRouteOptions<T>;
