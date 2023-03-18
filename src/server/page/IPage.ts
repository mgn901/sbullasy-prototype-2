import { IGroup } from '../group/IGroup';
import { IPageTag } from './IPageTag';
import { IPlace } from '../common/IPlace';
import { IProperty } from '../common/IProperty';
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
	place?: IPlace;
	tags: IPageTag[];
	properties: IProperty[];
}
