import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export type TUserForPublic = Omit<TEntityWithoutEntityKey<IUser>, 'email' | 'password'> & {
	tags: TEntityWithoutEntityKey<IUserTag>[];
	properties: TEntityWithoutEntityKey<TProperty>[];
}
