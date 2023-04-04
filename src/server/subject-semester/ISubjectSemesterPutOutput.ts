import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterPutOutput {
	subjectSemester: TEntityWithoutEntityKey<ISubjectSemester>;
}
