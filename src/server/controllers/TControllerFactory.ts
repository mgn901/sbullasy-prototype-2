import { FastifySchema } from 'fastify';
import { TRouteOptions } from './TRouteOptions.ts';
import { IRepository } from '../repositories/IRepository.ts';

export type TControllerFactory<T extends FastifySchema> = (options: {
  repository: IRepository;
}) => TRouteOptions<T>;
