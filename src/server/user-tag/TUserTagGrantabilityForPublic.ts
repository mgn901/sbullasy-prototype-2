import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IUserTagGrantability } from './IUserTagGrantability';
import { TUserTagForPublic } from './TUserTagForPublic';

export type TUserTagGrantabilityForPublic = Pick<TEntityWithoutEntityKey<IUserTagGrantability>, 'id' | 'expires' | 'expiresAt' | 'grantableByEmailRegex'> & {
	grantableByUserTag?: Pick<TUserTagForPublic, 'id' | 'name' | 'displayName'>;
}
