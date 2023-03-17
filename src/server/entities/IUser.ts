import { IGroup } from './IGroup';
import { IPage } from './IPage';
import { ISession } from './ISession';
import { IUserTag } from './IUserTag';

export interface IUser {
	id: string;
	email: string;
	password: string;
	displayName: string;
	tags: IUserTag[];
	sessions: ISession[];
	owns: IGroup[];
	belongs: IGroup[];
	watchesGroups: IGroup[];
	watchesPages: IPage[];
	pages: IPage[];
}
