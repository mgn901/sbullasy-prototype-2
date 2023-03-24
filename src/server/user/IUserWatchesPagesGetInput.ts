import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserWatchesPagesGetInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
