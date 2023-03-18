import { IUserTag } from './IUserTag';

export interface IUserTagPermission {
	id: string;
	tag: IUserTag;
	userGrantable?: IUserTag;
	emailRegexGrantable?: string;
	expires?: number;
}
