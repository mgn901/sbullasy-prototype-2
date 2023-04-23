import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IGroupTag } from '../group-tag/IGroupTag';
import { TProperty } from '../property/TProperty';
import { IGroup } from './IGroup';

export type TGroupForPublic = Pick<TEntityWithoutEntityKey<IGroup>, 'id' | 'name'> & {
	tags: TEntityWithoutEntityKey<IGroupTag>[];
	properties: TEntityWithoutEntityKey<TProperty>[];
}
