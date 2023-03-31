import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ITeacher } from './ITeacher';

export type ITeacherRepository = IRepository<ITeacher> & {
	findAll(): Promise<EntityAsync<ITeacher>[]>;
};
