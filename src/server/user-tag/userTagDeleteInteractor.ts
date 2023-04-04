import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IUserTag } from './IUserTag';
import { IUserTagDeleteInput } from './IUserTagDeleteInput';
import { IUserTagDeleteOutput } from './IUserTagDeleteOutput';
import { IUserTagRepository } from './IUserTagRepository';

interface IUserTagDeleteInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagDeleteInput,
	IUserTag
> {
	userRepository: IUserRepository;
}

export const userTagDeleteInteractor = async (params: IUserTagDeleteInteractorParams): Promise<IUserTagDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const { sessionID, tagID } = input;

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

	await repository.deleteByID(tagID);

	const output: IUserTagDeleteOutput = {};

	return output;
}
