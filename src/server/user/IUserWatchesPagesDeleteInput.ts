import { IPage } from '../page/IPage';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserWatchesPagesDeleteInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	pageID: IPage['id'];
}
