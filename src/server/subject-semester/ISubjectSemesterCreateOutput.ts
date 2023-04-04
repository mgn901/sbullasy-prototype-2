import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterCreateOutput {
	subjectSemester: TEntityWithoutEntityKey<ISubjectSemester>;
}
