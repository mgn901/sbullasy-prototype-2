import { IRepository } from '../IRepository';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from './IUserTag';

export type IUserTagRepository = IRepository<IUserTag> & {
	findAll(): Promise<TEntityAsync<IUserTag>[]>;
};
