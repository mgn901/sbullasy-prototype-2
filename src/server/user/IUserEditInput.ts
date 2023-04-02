import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserEditInput {
	sessionID: ISession['id'];
	user: Pick<EntityWithoutEntityKey<IUser>, 'id' | 'displayName'> & {
		properties: EntityWithoutEntityKey<TProperty>[];
	};
}
