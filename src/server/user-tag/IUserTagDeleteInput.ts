import { ISession } from '../session/ISession';
import { IUserTag } from './IUserTag';

export interface IUserTagDeleteInput {
	sessionID: ISession['id'];
	tagID: IUserTag['id'];
}
