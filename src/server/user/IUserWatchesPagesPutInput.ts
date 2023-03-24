import { IPage } from '../page/IPage';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserWatchesPagesPutInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	pageID: IPage['id'];
}
