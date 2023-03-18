import { IGroupTag } from '../group-tag/IGroupTag';
import { IPage } from '../page/IPage';
import { IProperty } from '../property/IProperty';
import { IUser } from '../user/IUser';

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
