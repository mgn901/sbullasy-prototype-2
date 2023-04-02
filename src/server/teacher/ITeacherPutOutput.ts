import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherPutOutput {
	teacher: EntityWithoutEntityKey<ITeacher>;
}
