import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { IProperty } from '../property/IProperty';
import { ISession } from '../session/ISession';
import { IUserTagRegistration } from './IUserTagRegistration';

export interface IUser {
	id: string;
	email: string;
	password: string;
	displayName: string;
	tagRegistrations: IUserTagRegistration[];
	properties: IProperty[];
	sessions: ISession[];
	owns: IGroup[];
	belongs: IGroup[];
	watchesGroups: IGroup[];
	watchesPages: IPage[];
	pages: IPage[];
}
