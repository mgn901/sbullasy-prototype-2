import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserMeGetOutput {
	user: Pick<EntityWithoutEntityKey<IUser>, 'id' | 'email' | 'displayName'> & {
		tags: TUserTagWithExpiresAt[];
		properties: EntityWithoutEntityKey<TProperty>[];
	};
}
