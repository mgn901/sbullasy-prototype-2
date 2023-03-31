import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekGetAllOutput {
	subjectWeeks: EntityWithoutEntityKey<ISubjectWeek>[];
}
