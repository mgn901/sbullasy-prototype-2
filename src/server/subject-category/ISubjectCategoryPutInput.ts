import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectCategory } from './ISubjectCategory';

export interface ISubjectCategoryPutInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	subjectCategory: ISubjectCategory;
}
