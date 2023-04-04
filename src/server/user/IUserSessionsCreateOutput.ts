import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserSessionsCreateOutput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
