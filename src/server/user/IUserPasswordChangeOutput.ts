import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserPasswordChangeOutput {
	id: IUser['id'];
	email: IUser['email'];
	displayName: IUser['displayName'];
	tags: TUserTagWithExpiresAt[];
	properties: EntityWithoutEntityKey<TProperty>[];
}
