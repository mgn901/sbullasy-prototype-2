import { IUserTag } from './IUserTag';

export interface IUserTagPermission {
	id: string;
	tag: IUserTag;
	userGrantable: IUserTag | undefined;
	emailRegexGrantable: string;
	expires: number | undefined;
}
