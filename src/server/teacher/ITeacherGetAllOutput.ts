import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherGetAllOutput {
	teachers: EntityWithoutEntityKey<ITeacher>[];
}
