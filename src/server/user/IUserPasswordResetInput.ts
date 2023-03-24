import { IResetPasswordRequest } from '../reset-password-request/IResetPasswordRequest';
import { IUser } from './IUser';

export interface IUserPasswordResetInput {
	id: IResetPasswordRequest['id'];
	email: IUser['email'];
	password: IUser['password'];
}
