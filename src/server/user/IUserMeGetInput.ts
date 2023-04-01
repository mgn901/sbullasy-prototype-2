import { ISession } from '../session/ISession';

export interface IUserMeGetInput {
	sessionID: ISession['id'];
}
