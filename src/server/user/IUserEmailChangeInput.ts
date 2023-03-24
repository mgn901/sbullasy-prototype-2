import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserEmailChangeInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	email: IUser['email'];
}
