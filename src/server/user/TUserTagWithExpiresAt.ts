import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IUserTag } from '../user-tag/IUserTag';

export type TUserTagWithExpiresAt = EntityWithoutEntityKey<IUserTag> & {
	expiresAt?: number;
}
