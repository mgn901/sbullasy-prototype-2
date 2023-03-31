import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectWeek } from './ISubjectWeek';

export type ISubjectWeekRepository = IRepository<ISubjectWeek> & {
	findAll(): Promise<EntityAsync<ISubjectWeek>[]>;
};
