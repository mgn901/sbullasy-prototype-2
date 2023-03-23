import { IUser } from '../user/IUser';
import { IUserTag } from '../user-tag/IUserTag';
import { IUserTagGrantability } from '../user-tag/IUserTagGrantability';

export interface IUserTagRequest {
	id: string;
	user: IUser;
	tag: IUserTag;
	grantability: IUserTagGrantability;
	email: string;
	createdAt: number;
	isDisposed: boolean;
	token: string;
}
