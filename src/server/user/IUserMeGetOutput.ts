import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserMeGetOutput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'id' | 'email' | 'displayName'> & {
		tags: TUserTagWithExpiresAt[];
		properties: TEntityWithoutEntityKey<TProperty>[];
	};
}
