import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectCategory } from './ISubjectCategory';

export type ISubjectCategoryRepository = IRepository<ISubjectCategory> & {
	findAll(): Promise<EntityAsync<ISubjectCategory>[]>;
};
