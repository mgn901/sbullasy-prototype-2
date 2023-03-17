import { IGroup } from './IGroup';
import { IPage } from './IPage';

export interface IProperty<Key = string, Value = string> {
	id: string;
	key: Key;
	value: Value;
	group: IGroup | undefined;
	page: IPage | undefined;
}
