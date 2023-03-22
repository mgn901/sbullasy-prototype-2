import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { IProperty } from '../property/IProperty';
import { ISession } from '../session/ISession';
import { IUserTag } from '../user-tag/IUserTag';

export interface IUser {
	id: string;
	email: string;
	password: string;
	displayName: string;
	tags: IUserTag[];
	properties: IProperty[];
	sessions: ISession[];
	owns: IGroup[];
	belongs: IGroup[];
	watchesGroups: IGroup[];
	watchesPages: IPage[];
	pages: IPage[];
}
