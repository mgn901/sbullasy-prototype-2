import { IUserTag } from '../user-tag/IUserTag';

export interface IUserTagRegistration {
	readonly id: string;
	readonly tag: IUserTag;
	readonly expiresAt?: number;
}
