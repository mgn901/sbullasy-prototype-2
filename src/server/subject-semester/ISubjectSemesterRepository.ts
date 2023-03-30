import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ISubjectSemester } from './ISubjectSemester';

export type ISubjectSemesterRepository = IRepository<ISubjectSemester> & {
	findAll(): Promise<EntityAsync<ISubjectSemester>[]>;
};
