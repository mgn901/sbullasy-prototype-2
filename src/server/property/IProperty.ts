import { EntityAsync } from '../EntityAsync';
import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { IUser } from '../user/IUser';

export interface IProperty<Key extends string = string, Value extends string = string> {
	id: string;
	key: Key;
	value: Value;
	user?: IUser;
	group?: IGroup;
	page?: IPage;
}

export type IPropertyAsync = EntityAsync<IProperty>;
