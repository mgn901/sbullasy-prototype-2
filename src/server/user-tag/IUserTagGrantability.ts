import { IUserTag } from './IUserTag';

export interface IUserTagGrantability {
	readonly id: string;
	readonly tag: IUserTag;
	grantableByUserTag?: IUserTag;
	grantableByEmailRegex?: string;
	expires?: number;
	expiresAt?: number;
}
