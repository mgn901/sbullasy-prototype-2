import { TEntityAsync } from '../TEntityAsync';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { promisedMap } from '../utils/promisedMap';
import { IUserTag } from './IUserTag';
import { TUserTagForPublic } from './TUserTagForPublic';
import { userTagGrantabilityToUserTagGrantabilityForPublic } from './userTagGrantabilityToUserTagGrantabilityForPublic';

export const userTagToUserTagForPublic = async (userTag: TEntityAsync<IUserTag>): Promise<TUserTagForPublic> => {
	const userTagPartial: TUserTagForPublic = {
		id: userTag.id,
		displayName: userTag.displayName,
		name: userTag.name,
		grantableBy: await promisedMap(userTagGrantabilityToUserTagGrantabilityForPublic, await userTag.grantableBy),
	}
	return userTagPartial;
}
