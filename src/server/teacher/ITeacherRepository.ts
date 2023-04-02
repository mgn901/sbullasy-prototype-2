import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ITeacher } from './ITeacher';

export type ITeacherRepository = IRepository<ITeacher> & {
	findAll(): Promise<TEntityAsync<ITeacher>[]>;
};
