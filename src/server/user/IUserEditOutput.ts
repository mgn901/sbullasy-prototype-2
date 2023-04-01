import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserEditOutput {
	user: Pick<EntityWithoutEntityKey<IUser>, 'id' | 'email' | 'displayName'> & {
		tags: TUserTagWithExpiresAt[];
		properties: EntityWithoutEntityKey<TProperty>[];
	};
}
