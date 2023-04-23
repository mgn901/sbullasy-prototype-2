import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IUser } from '../user/IUser';

export interface IStartInput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'email' | 'displayName'>;
}
