import { IPageTag } from './IPageTag';
import { IUserTag } from '../user/IUserTag';

export interface IPageTagPermission {
	id: string;
	tag: IPageTag;
	grantableBy: IUserTag;
}
