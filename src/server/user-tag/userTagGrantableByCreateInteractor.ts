import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { NotFoundError } from '../error/NotFoundError';
import { IUserRepository } from '../user/IUserRepository';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';
import { IUserTagGrantableByCreateInput } from './IUserTagGrantableByCreateInput';
import { IUserTagGrantableByCreateOutput } from './IUserTagGrantableByCreateOutput';
import { IUserTagRepository } from './IUserTagRepository';
import { userTagGrantabilityToUserTagGrantabilityForPublic } from './userTagGrantabilityToUserTagGrantabilityForPublic';

interface IUserTagGrantableByCreateInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagGrantableByCreateInput,
	IUserTag
> {
	userRepository: IUserRepository;
}

export const userTagGrantableByCreateInteractor = async (params: IUserTagGrantableByCreateInteractorParams): Promise<IUserTagGrantableByCreateOutput> => {
	const { repository, input, userRepository } = params;
	const { sessionID, userTagID } = input;
	const userTagGrantabilityPartial = input.userTagGrantability;

	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: userRepository,
	});
	if (!(verifySessionResult.status)) {
		throw verifySessionResult.error;
	}
	const user = verifySessionResult.user;
	const verifyUserTagResult = await verifyUserTag({
		userID: user.id,
		userRepository: userRepository,
		tagNeeded: 'user-tag_write',
	});
	if (!(verifyUserTagResult.status)) {
		throw verifyUserTagResult.error;
	}

	const tag = await repository.findByID(userTagID);
	if (!tag) {
		const error = new NotFoundError({
			message: `The tag (tagID: ${userTagID}) is not found.`,
		});
		throw error;
	}

	const grantableBy = await tag.grantableBy;
	const grantableByUserTag = userTagGrantabilityPartial.grantableByUserTag
		? await repository.findByID(userTagGrantabilityPartial.grantableByUserTag)
		: undefined;
	const userTagGrantabilitySaved: TEntityAsync<IUserTagGrantability> = {
		id: userTagGrantabilityPartial.id,
		tag: tag,
		expires: userTagGrantabilityPartial.expires,
		expiresAt: userTagGrantabilityPartial.expiresAt,
		grantableByEmailRegex: userTagGrantabilityPartial.grantableByEmailRegex,
		grantableByUserTag: grantableByUserTag,
	};
	grantableBy.push(userTagGrantabilitySaved);
	tag.grantableBy = grantableBy;
	await repository.save(tag);

	const userTagGrantabilityForPublic = await userTagGrantabilityToUserTagGrantabilityForPublic(userTagGrantabilitySaved);
	const output: IUserTagGrantableByCreateOutput = {
		userTagID: tag.id,
		userTagGrantability: userTagGrantabilityForPublic,
	};

	return output;
}
