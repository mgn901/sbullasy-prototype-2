import { IGroup } from '../group/IGroup';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserWatchesGroupsPutInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	groupID: IGroup['id'];
}
