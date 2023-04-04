import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserSessionsDeleteInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	sessionName: ISession['name'];
}
