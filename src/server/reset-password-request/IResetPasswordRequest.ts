import { IUser } from '../user/IUser';

export interface IResetPasswordRequest {
	id: string;
	user: IUser;
	email: string;
	createdAt: number;
	isDisposed: boolean;
}
