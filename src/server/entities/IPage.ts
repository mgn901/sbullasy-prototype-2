import { IGroup } from './IGroup';
import { IPageTag } from './IPageTag';
import { IPlace } from './IPlace';
import { IProperty } from './IProperty';
import { IUser } from './IUser';

export interface IPage {
	id: string;
	name: string;
	type: 'page' | 'event' | 'image';
	body: string;
	createdAt: number;
	updatedAt: number;
	createdByUser?: IUser;
	createdByGroup?: IGroup;
	startsAt?: number;
	endsAt?: number;
	place?: IPlace;
	tags: IPageTag[];
	properties: IProperty[];
}
