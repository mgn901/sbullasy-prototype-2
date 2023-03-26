import { IGroupTag } from '../group-tag/IGroupTag';
import { IPage } from '../page/IPage';
import { TProperty } from '../property/TProperty';
import { IUser } from '../user/IUser';

export interface IGroup {
	readonly id: string;
	name: string;
	readonly createdAt: number;
	updatedAt: number;
	invitationToken: string;
	tags: IGroupTag[];
	properties: TProperty[];
	owner: IUser;
	members: IUser[];
	pages: IPage[];
}
