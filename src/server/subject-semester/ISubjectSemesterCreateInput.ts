import { IAPIToken } from '../api-token/IAPIToken';
import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterCreateInput {
	apiToken: IAPIToken['token'];
	sessionID: ISession['id'];
	subjectSemester: Omit<EntityWithoutEntityKey<ISubjectSemester>, 'id'>;
}
