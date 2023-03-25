import { IUserTag } from '../user-tag/IUserTag';

export interface IGroupTag {
	readonly id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTag[];
}
