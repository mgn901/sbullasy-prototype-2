import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserCreateOutput {
	user: Omit<EntityWithoutEntityKey<IUser>, 'password'> & {
		tags: TUserTagWithExpiresAt[];
		properties: EntityWithoutEntityKey<TProperty>[];
	};
	sessionID: ISession['id'];
}
