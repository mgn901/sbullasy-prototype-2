import { IGroup } from '../group/IGroup';
import { IPageTag } from '../page-tag/IPageTag';
import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { IUser } from '../user/IUser';

export interface IPage {
	readonly id: string;
	name: string;
	readonly type: 'page' | 'event' | 'image';
	body: string;
	readonly createdAt: number;
	updatedAt: number;
	readonly createdByUser?: IUser;
	readonly createdByGroup?: IGroup;
	startsAt?: number;
	endsAt?: number;
	places: IPlace[];
	tags: IPageTag[];
	properties: IProperty[];
}
