import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserSessionsCreateInput {
	email: IUser['email'];
	password: IUser['password'];
	ipAddress: ISession['ipAddress'];
}
