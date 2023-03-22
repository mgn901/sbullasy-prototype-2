import { IUser } from '../user/IUser';

export interface ISession {
	id: string;
	user: IUser;
	loggedInAt: number;
	expiresAt: number;
	ipAddress: string;
	name: string;
}
