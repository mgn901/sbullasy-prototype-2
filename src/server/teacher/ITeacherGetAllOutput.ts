import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherGetAllOutput {
	teachers: TEntityWithoutEntityKey<ITeacher>[];
}
