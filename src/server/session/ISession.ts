import { IUser } from '../user/IUser';

export interface ISession {
	readonly id: string;
	readonly user: IUser;
	readonly loggedInAt: number;
	readonly expiresAt: number;
	readonly ipAddress: string;
	readonly name: string;
}
