import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekGetAllOutput {
	subjectWeeks: TEntityWithoutEntityKey<ISubjectWeek>[];
}
