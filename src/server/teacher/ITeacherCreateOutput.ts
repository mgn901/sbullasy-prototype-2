import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherCreateOutput {
	teacher: TEntityWithoutEntityKey<ITeacher>;
}
