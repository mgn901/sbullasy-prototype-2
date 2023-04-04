import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { ITeacher } from './ITeacher';

export interface ITeacherCreateInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	teacher: Omit<TEntityWithoutEntityKey<ITeacher>, 'id'>;
}
