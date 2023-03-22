import { IUser } from '../user/IUser';
import { IUserTag } from '../user-tag/IUserTag';

export interface IUserTagRequest {
	id: string;
	user: IUser;
	tag: IUserTag;
	email: string;
	createdAt: number;
	isDisposed: boolean;
	token: string;
}
