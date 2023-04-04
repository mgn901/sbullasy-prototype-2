import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserSessionsGetAllInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
