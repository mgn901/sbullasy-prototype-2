import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekCreateOutput {
	subjectWeek: EntityWithoutEntityKey<ISubjectWeek>;
}
