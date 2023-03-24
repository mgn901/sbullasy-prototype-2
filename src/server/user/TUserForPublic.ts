import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IProperty } from '../property/IProperty';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export type TUserForPublic = Omit<EntityWithoutEntityKey<IUser>, 'email' | 'password'> & {
	tags: EntityWithoutEntityKey<IUserTag>[];
	properties: EntityWithoutEntityKey<IProperty>[];
}
