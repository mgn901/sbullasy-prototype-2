import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ITeacher } from './ITeacher';

export interface ITeacherPutInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	teacher: TEntityWithoutEntityKey<ITeacher>;
}
