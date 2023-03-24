import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IProperty } from '../property/IProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserEmailChangeOutput {
	id: IUser['id'];
	email: IUser['email'];
	displayName: IUser['displayName'];
	tags: TUserTagWithExpiresAt[];
	properties: EntityWithoutEntityKey<IProperty>[];
}
