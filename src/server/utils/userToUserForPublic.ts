import { TEntityAsync } from '../TEntityAsync';
import { IUser } from '../user/IUser';
import { TUserForPublic } from '../user/TUserForPublic';
import { promisedMap } from './promisedMap';
import { propertyToPropertyWithoutEntityKey } from './propertyToPropertyWithoutEntityKey';
import { userTagRegistrationToUserTagWithExpiresAt } from './userTagRegistrationToUserTagWithExpiresAt';

export const userToUserForPublic = async (user: TEntityAsync<IUser>): Promise<TUserForPublic> => {
	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await user.properties);
	const tags = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, await user.tagRegistrations);

	const userForPublic: TUserForPublic = {
		id: user.id,
		displayName: user.displayName,
		tags: tags,
		properties: properties,
	};

	return userForPublic;
}
