import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserDeleteInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
