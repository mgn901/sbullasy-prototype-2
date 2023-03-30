import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubject } from './ISubject';

export interface ISubjectDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	subjectID: ISubject['id'];
}
