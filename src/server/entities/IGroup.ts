import { IGroupTag } from './IGroupTag';
import { IPage } from './IPage';
import { IProperty } from './IProperty';
import { IUser } from './IUser';

export interface IGroup {
	id: string;
	name: string;
	createdAt: number;
	updatedAt: number;
	invitationToken: string;
	tags: IGroupTag[];
	properties: IProperty[];
	owner: IUser;
	members: IUser[];
	pages: IPage[];
}
