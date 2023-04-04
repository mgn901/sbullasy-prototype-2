import { TEntityAsync } from '../TEntityAsync';
import { IUserTagGrantability } from './IUserTagGrantability';
import { TUserTagGrantabilityForPublic } from './TUserTagGrantabilityForPublic';

export const userTagGrantabilityToUserTagGrantabilityForPublic = async (grantability: TEntityAsync<IUserTagGrantability>): Promise<TUserTagGrantabilityForPublic> => {
	const grantableByUserTag = await grantability.grantableByUserTag;
	const grantabilityForPublic: TUserTagGrantabilityForPublic = {
		id: grantability.id,
		expires: grantability.expires,
		expiresAt: grantability.expiresAt,
		grantableByEmailRegex: grantability.grantableByEmailRegex,
		grantableByUserTag: grantableByUserTag ? {
			id: grantableByUserTag.id,
			name: grantableByUserTag.name,
			displayName: grantableByUserTag.displayName,
		} : undefined,
	};
	return grantabilityForPublic;
}
