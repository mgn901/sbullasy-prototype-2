import { IUser } from '../user/IUser';

export interface IUndoChangeEmailRequest {
	readonly id: string;
	readonly user: IUser;
	readonly email: string;
	readonly createdAt: number;
}
