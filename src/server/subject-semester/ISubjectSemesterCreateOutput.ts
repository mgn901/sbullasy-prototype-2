import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterCreateOutput {
	subjectSemester: EntityWithoutEntityKey<ISubjectSemester>;
}
