import { IAPIToken } from '../api-token/IAPIToken';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterCreateInput {
	apiToken: IAPIToken['token'];
	sessionID: ISession['id'];
	subjectSemester: Omit<TEntityWithoutEntityKey<ISubjectSemester>, 'id'>;
}
