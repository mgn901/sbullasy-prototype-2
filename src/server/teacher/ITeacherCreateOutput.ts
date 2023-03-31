import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherCreateOutput {
	teacher: EntityWithoutEntityKey<ITeacher>;
}
