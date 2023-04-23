import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TGroupForPublic } from '../group/TGroupForPublic';
import { IPageTag } from '../page-tag/IPageTag';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { TUserForPublic } from '../user/TUserForPublic';
import { IPage } from './IPage';

export type TPageForPublic = Omit<TEntityWithoutEntityKey<IPage>, 'body' | 'createdByUser' | 'createdByGroup'> & {
	createdByUser?: TUserForPublic;
	createdByGroup?: TGroupForPublic;
	places: TEntityWithoutEntityKey<IPlace>[];
	tags: TEntityWithoutEntityKey<IPageTag>[];
	properties: TEntityWithoutEntityKey<TProperty>[];
}
