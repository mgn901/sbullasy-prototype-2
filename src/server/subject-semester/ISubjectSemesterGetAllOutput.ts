import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterGetAllOutput {
	subjectSemesters: EntityWithoutEntityKey<ISubjectSemester>[];
}
