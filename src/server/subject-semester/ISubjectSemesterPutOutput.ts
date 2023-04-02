import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterPutOutput {
	subjectSemester: EntityWithoutEntityKey<ISubjectSemester>;
}
