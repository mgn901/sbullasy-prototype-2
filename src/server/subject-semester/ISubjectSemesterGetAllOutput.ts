import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterGetAllOutput {
	subjectSemesters: EntityWithoutEntityKey<ISubjectSemester>[];
}
