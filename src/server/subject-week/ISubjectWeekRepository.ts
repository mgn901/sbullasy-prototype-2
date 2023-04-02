import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectWeek } from './ISubjectWeek';

export type ISubjectWeekRepository = IRepository<ISubjectWeek> & {
	findAll(): Promise<TEntityAsync<ISubjectWeek>[]>;
};
