import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterCreateOutput {
	subjectSemester: EntityWithoutEntityKey<ISubjectSemester>;
}
