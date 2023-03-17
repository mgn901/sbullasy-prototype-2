import { IUser } from './IUser';

export interface IUndoChangeEmailRequest {
	id: string;
	user: IUser;
	email: string;
	createdAt: number;
}
