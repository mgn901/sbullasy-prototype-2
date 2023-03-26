import { IAPIToken } from '../api-token/IAPIToken';
import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUserTagRegistration } from './IUserTagRegistration';

export interface IUser {
	readonly id: string;
	email: string;
	password: string;
	displayName: string;
	tagRegistrations: IUserTagRegistration[];
	properties: TProperty[];
	sessions: ISession[];
	owns: IGroup[];
	belongs: IGroup[];
	watchesGroups: IGroup[];
	watchesPages: IPage[];
	pages: IPage[];
	apiTokens: IAPIToken[];
}
