import { IGroupTag } from './IGroupTag';
import { IUserTag } from '../user-tag/IUserTag';

export interface IGroupTagPermission {
	id: string;
	tag: IGroupTag;
	grantableBy: IUserTag;
}
