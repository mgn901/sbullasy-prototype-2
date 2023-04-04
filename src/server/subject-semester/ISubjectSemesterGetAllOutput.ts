import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterGetAllOutput {
	subjectSemesters: TEntityWithoutEntityKey<ISubjectSemester>[];
}
