import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekCreateOutput {
	subjectWeek: EntityWithoutEntityKey<ISubjectWeek>;
}
