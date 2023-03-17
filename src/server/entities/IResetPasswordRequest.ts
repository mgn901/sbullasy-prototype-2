import { IUser } from './IUser';

export interface IResetPasswordRequest {
	id: string;
	user: IUser;
	email: string;
	createdAt: number;
	isDisposed: boolean;
}
