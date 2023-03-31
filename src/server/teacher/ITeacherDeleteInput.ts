import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ITeacher } from './ITeacher';

export interface ITeacherDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	id: ITeacher['id'];
}
