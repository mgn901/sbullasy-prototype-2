import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ISubject } from './ISubject';

export type ISubjectRepository = IRepository<ISubject> & {
	findAll(): Promise<TEntityAsync<ISubject>[]>;
};
