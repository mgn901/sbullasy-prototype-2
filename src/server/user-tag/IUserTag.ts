import { IUserTagGrantability } from './IUserTagGrantability';

export interface IUserTag {
	id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTagGrantability[];
}
