import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export type TUserForPublic = Pick<TEntityWithoutEntityKey<IUser>, 'id' | 'displayName'> & {
	tags: TEntityWithoutEntityKey<IUserTag>[];
	properties: TEntityWithoutEntityKey<TProperty>[];
}
