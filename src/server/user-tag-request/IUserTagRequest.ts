import { IUser } from '../user/IUser';
import { IUserTag } from '../user-tag/IUserTag';
import { IUserTagGrantability } from '../user-tag/IUserTagGrantability';

export interface IUserTagRequest {
	readonly id: string;
	readonly user: IUser;
	readonly tag: IUserTag;
	readonly grantability: IUserTagGrantability;
	readonly email: string;
	readonly createdAt: number;
	isDisposed: boolean;
	readonly token: string;
}
