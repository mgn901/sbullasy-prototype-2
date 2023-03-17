import { IUser } from './IUser';

export interface ISession {
	id: string;
	user: IUser;
	loggedInAt: number;
	ipAddress: string;
	name: string;
}
