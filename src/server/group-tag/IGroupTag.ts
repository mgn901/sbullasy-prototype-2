import { IUserTag } from '../user-tag/IUserTag';

export interface IGroupTag {
	id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTag[];
}
