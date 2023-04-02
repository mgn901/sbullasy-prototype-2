import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherCreateOutput {
	teacher: EntityWithoutEntityKey<ITeacher>;
}
