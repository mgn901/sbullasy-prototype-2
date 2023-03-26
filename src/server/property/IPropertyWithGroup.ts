import { IGroup } from '../group/IGroup';

export interface IPropertyWithGroup<Key extends string = string> {
	readonly id: string;
	readonly key: Key;
	readonly type: 'group';
	value?: IGroup;
}
