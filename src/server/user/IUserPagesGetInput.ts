import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserPagesGetInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
