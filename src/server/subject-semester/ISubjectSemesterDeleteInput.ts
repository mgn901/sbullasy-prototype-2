import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	id: ISubjectSemester['id'];
}
