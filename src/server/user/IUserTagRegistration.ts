import { IUserTag } from '../user-tag/IUserTag';

export interface IUserTagRegistration {
	id: string;
	tag: IUserTag;
	expiresAt?: number;
}
