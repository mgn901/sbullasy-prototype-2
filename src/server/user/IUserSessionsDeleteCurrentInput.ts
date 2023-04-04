import { ISession } from '../session/ISession';

export interface IUserSessionsDeleteCurrentInput {
	sessionID: ISession['id'];
}
