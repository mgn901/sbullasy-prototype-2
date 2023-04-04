import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserSessionsCreateInput {
	email: IUser['email'];
	createSessionRequestToken: ICreateSessionRequest['token'];
	ipAddress: ISession['ipAddress'];
}
