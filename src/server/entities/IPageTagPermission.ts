import { IPageTag } from './IPageTag';
import { IUserTag } from './IUserTag';

export interface IPageTagPermission {
	id: string;
	tag: IPageTag;
	grantableBy: IUserTag;
}
