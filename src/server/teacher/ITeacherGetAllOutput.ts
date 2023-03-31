import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ITeacher } from './ITeacher';

export interface ITeacherGetAllOutput {
	teachers: EntityWithoutEntityKey<ITeacher>[];
}
