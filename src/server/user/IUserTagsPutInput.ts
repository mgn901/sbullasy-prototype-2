import { ISession } from '../session/ISession';
import { IUserTagRequest } from '../user-tag-request/IUserTagRequest';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export interface IUserTagsPutInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	tagID: IUserTag['id'];
	reason?: IUserTag['id'];
	requestToken?: IUserTagRequest['token'];
}
