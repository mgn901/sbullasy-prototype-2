import { IUser } from '../user/IUser';

export interface IResetPasswordRequest {
	readonly id: string;
	readonly user: IUser;
	readonly email: string;
	readonly createdAt: number;
	isDisposed: boolean;
}
