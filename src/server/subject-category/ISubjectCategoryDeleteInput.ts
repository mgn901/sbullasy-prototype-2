import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectCategory } from './ISubjectCategory';

export interface ISubjectCategoryDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	id: ISubjectCategory['id'];
}
