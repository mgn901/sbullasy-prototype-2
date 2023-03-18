import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';

export interface IProperty<Key = string, Value = string> {
	id: string;
	key: Key;
	value: Value;
	group: IGroup | undefined;
	page: IPage | undefined;
}
