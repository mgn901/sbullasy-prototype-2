import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekCreateInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	subjectWeek: Omit<EntityWithoutEntityKey<ISubjectWeek>, 'id'>;
}
