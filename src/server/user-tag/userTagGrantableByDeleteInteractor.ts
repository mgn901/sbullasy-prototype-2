import { IInteractorParams } from '../IInteractorParams';
import { NotFoundError } from '../error/NotFoundError';
import { IUserRepository } from '../user/IUserRepository';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IUserTag } from './IUserTag';
import { IUserTagGrantableByDeleteInput } from './IUserTagGrantableByDeleteInput';
import { IUserTagGrantableByDeleteOutput } from './IUserTagGrantableByDeleteOutput';
import { IUserTagRepository } from './IUserTagRepository';

interface IUserTagGrantableByDeleteInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagGrantableByDeleteInput,
	IUserTag
> {
	userRepository: IUserRepository,
}

export const userTagGrantableByDeleteInteractor = async (params: IUserTagGrantableByDeleteInteractorParams): Promise<IUserTagGrantableByDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const { sessionID, userTagID, userTagGrantabilityID } = input;

	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: userRepository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	const user = verifySessionResult.user;
	const verifyUserTagResult = await verifyUserTag({
		userID: user.id,
		userRepository: userRepository,
		tagNeeded: 'user-tag_write',
	});
	if (!verifyUserTagResult.status) {
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
	const deletedIdx = grantableBy.findIndex((grantability) => {
		return grantability.id === userTagGrantabilityID;
	});
	if (deletedIdx === -1) {
		const error = new NotFoundError({
			message: `The tag grantability (grantabilityID: ${userTagGrantabilityID}) is not found.`,
		});
		throw error;
	}
	grantableBy.splice(deletedIdx, 1);
	tag.grantableBy = grantableBy;
	await repository.save(tag);

	const output: IUserTagGrantableByDeleteOutput = {};

	return output;
}
