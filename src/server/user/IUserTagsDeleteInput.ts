import { ISession } from '../session/ISession';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export interface IUserTagsDeleteInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	tagID: IUserTag['id'];
}
