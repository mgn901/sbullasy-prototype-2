import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherPutOutput {
	teacher: EntityWithoutEntityKey<ITeacher>;
}
