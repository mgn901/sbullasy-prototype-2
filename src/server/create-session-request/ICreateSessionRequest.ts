import { IUser } from '../user/IUser';

export interface ICreateSessionRequest {
	readonly id: string;
	readonly user: IUser;
	readonly createdAt: number;
	readonly token: string;
	isDisposed: boolean;
}
