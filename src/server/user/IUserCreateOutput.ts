import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserCreateOutput {
	user: Omit<TEntityWithoutEntityKey<IUser>, 'password'> & {
		tags: TUserTagWithExpiresAt[];
		properties: TEntityWithoutEntityKey<TProperty>[];
	};
	sessionID: ISession['id'];
}
