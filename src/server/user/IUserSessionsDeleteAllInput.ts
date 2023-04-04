import { ISession } from '../session/ISession';

export interface IUserSessionsDeleteAllInput {
	sessionID: ISession['id'];
	userID: ISession['id'];
}
