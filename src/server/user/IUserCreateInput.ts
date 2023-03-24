import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserCreateInput {
	email: IUser['email'];
	password: IUser['password'];
	displayName: IUser['displayName'];
	ipAddress: ISession['ipAddress'];
}
