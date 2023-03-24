import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserMeGetInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
