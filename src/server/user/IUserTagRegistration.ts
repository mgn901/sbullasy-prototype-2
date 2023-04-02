import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export interface IUserTagRegistration {
	readonly id: string;
	readonly user: IUser;
	readonly tag: IUserTag;
	readonly expiresAt?: number;
}
