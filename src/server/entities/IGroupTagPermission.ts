import { IGroupTag } from './IGroupTag';
import { IUserTag } from './IUserTag';

export interface IGroupTagPermission {
	id: string;
	tag: IGroupTag;
	grantableBy: IUserTag;
}
