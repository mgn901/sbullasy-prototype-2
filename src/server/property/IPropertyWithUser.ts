import { IUser } from '../user/IUser';

export interface IPropertyWithUser<Key extends string = string> {
	readonly id: string;
	readonly key: Key;
	readonly type: 'user';
	value?: IUser;
}
