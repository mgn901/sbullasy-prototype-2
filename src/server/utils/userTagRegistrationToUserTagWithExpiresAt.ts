import { EntityAsync } from '../EntityAsync';
import { IUserTagRegistration } from '../user/IUserTagRegistration';
import { TUserTagWithExpiresAt } from '../user/TUserTagWithExpiresAt';

export const userTagRegistrationToUserTagWithExpiresAt = async (registration: EntityAsync<IUserTagRegistration>): Promise<TUserTagWithExpiresAt> => {
	const tag = await registration.tag;

	const tagWithExpiresAt: TUserTagWithExpiresAt = {
		id: tag.id,
		name: tag.name,
		displayName: tag.displayName,
		expiresAt: registration.expiresAt,
	};

	return tagWithExpiresAt;
}
