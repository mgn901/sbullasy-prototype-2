import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserWatchesGroupsGetInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
}
