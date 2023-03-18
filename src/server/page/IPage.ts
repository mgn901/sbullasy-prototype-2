import { IGroup } from '../group/IGroup';
import { IPageTag } from '../page-tag/IPageTag';
import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { IUser } from '../user/IUser';

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
	places: IPlace[];
	tags: IPageTag[];
	properties: IProperty[];
}
