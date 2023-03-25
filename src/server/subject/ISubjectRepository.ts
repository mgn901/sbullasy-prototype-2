import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ISubject } from './ISubject';

export type ISubjectRepository = IRepository<ISubject> & {
	findAll(): Promise<EntityAsync<ISubject>[]>;
};
