import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ISubjectCategory } from './ISubjectCategory';

export interface ISubjectCategoryCreateInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	subjectCategory: Omit<ISubjectCategory, 'id'>;
}
