import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectSemester } from './ISubjectSemester';

export type ISubjectSemesterRepository = IRepository<ISubjectSemester> & {
	findAll(): Promise<TEntityAsync<ISubjectSemester>[]>;
};
