import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IUserTag } from './IUserTag';
import { TUserTagGrantabilityForPublic } from './TUserTagGrantabilityForPublic';

export type TUserTagForPublic = TEntityWithoutEntityKey<IUserTag> & {
	grantableBy: TUserTagGrantabilityForPublic[];
}
