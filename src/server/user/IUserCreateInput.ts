import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserCreateInput {
	user: Pick<EntityWithoutEntityKey<IUser>, 'email' | 'displayName' | 'password'>;
	ipAddress: ISession['ipAddress'];
}
