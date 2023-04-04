import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IUser } from './IUser';

export interface IUserCreateIfNotExistsAndCreateSessionRequestCreateInput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'email' | 'ipAddress'>;
}
