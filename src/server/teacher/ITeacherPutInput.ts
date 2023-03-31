import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ITeacher } from './ITeacher';

export interface ITeacherPutInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	teacher: EntityWithoutEntityKey<ITeacher>;
}
