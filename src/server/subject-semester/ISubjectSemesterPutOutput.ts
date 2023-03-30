import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterPutOutput {
	subjectSemester: EntityWithoutEntityKey<ISubjectSemester>;
}
