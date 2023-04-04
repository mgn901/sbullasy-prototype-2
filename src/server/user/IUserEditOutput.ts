import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserEditOutput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'id' | 'email' | 'displayName'> & {
		tags: TUserTagWithExpiresAt[];
		properties: TEntityWithoutEntityKey<TProperty>[];
	};
}
