import { IUserTagGrantability } from './IUserTagGrantability';

export interface IUserTag {
	readonly id: string;
	name: string;
	displayName: string;
	grantableBy: IUserTagGrantability[];
}
