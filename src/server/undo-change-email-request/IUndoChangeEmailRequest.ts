import { IUser } from '../user/IUser';

export interface IUndoChangeEmailRequest {
	id: string;
	user: IUser;
	email: string;
	createdAt: number;
}
