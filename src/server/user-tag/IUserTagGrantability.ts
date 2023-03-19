import { IUserTag } from './IUserTag';

export interface IUserTagGrantability {
	id: string;
	tag: IUserTag;
	grantableByUserTag?: IUserTag;
	grantableByEmailRegex?: string;
	expires?: number;
}
