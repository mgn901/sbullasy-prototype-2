import { IUserTag } from '../user-tag/IUserTag';

export interface IPageTag {
	readonly id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTag[];
}
