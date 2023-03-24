import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserPasswordChangeInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	oldPassword: IUser['password'];
	newPassword: IUser['password'];
}
