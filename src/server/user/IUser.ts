import { IAPIToken } from '../api-token/IAPIToken';
import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { TProperty } from '../property/TProperty';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { ISession } from '../session/ISession';
import { IUserTagRegistration } from './IUserTagRegistration';

export interface IUser {
	readonly id: string;
	email: string;
	displayName: string;
	readonly createdAt: number;
	readonly ipAddress: string;
	isOnboarded: boolean;
	tagRegistrations: IUserTagRegistration[];
	properties: TProperty[];
	sessions: ISession[];
	createSessionRequests: ICreateSessionRequest[];
	owns: IGroup[];
	belongs: IGroup[];
	watchesGroups: IGroup[];
	watchesPages: IPage[];
	pages: IPage[];
	apiTokens: IAPIToken[];
}
