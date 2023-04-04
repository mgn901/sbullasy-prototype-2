import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherPutOutput {
	teacher: TEntityWithoutEntityKey<ITeacher>;
}
