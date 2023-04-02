import { IAPIToken } from '../api-token/IAPIToken';
import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { ISubjectSemester } from './ISubjectSemester';

export interface ISubjectSemesterPutInput {
	apiToken: IAPIToken['token'];
	sessionID: ISession['id'];
	subjectSemester: EntityWithoutEntityKey<ISubjectSemester>;
}
