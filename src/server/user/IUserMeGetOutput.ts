import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TGroupForPublic } from '../group/TGroupForPublic';
import { TProperty } from '../property/TProperty';
import { IUser } from './IUser';
import { TUserTagWithExpiresAt } from './TUserTagWithExpiresAt';

export interface IUserMeGetOutput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'id' | 'email' | 'displayName'> & {
		owns: TGroupForPublic[];
		belongs: TGroupForPublic[];
		tags: TUserTagWithExpiresAt[];
		properties: TEntityWithoutEntityKey<TProperty>[];
	};
}
