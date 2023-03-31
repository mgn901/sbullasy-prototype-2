import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectWeek } from './ISubjectWeek';

export interface ISubjectWeekDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	id: ISubjectWeek['id'];
}
