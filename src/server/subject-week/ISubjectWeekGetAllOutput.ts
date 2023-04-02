import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekGetAllOutput {
	subjectWeeks: EntityWithoutEntityKey<ISubjectWeek>[];
}
