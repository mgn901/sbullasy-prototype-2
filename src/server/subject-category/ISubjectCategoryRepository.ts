import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectCategory } from './ISubjectCategory';

export type ISubjectCategoryRepository = IRepository<ISubjectCategory> & {
	findAll(): Promise<TEntityAsync<ISubjectCategory>[]>;
};
