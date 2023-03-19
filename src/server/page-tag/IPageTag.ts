import { IUserTag } from '../user-tag/IUserTag';

export interface IPageTag {
	id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTag[];
}
