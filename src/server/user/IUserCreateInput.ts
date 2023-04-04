import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserCreateInput {
	user: Pick<TEntityWithoutEntityKey<IUser>, 'email' | 'displayName' | 'password'>;
	ipAddress: ISession['ipAddress'];
}
