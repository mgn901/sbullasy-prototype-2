import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IUserTag } from '../user-tag/IUserTag';

export type TUserTagWithExpiresAt = TEntityWithoutEntityKey<IUserTag> & {
	expiresAt?: number;
}
