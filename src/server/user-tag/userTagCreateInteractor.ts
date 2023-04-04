import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IUserTag } from './IUserTag';
import { IUserTagCreateInput } from './IUserTagCreateInput';
import { IUserTagCreateOutput } from './IUserTagCreateOutput';
import { IUserTagRepository } from './IUserTagRepository';
import { TUserTagForPublic } from './TUserTagForPublic';

interface IUserTagCreateInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagCreateInput,
	IUserTag
> {
	userRepository: IUserRepository;
}

export const userTagCreateInteractor = async (params: IUserTagCreateInteractorParams): Promise<IUserTagCreateOutput> => {
	const { repository, input, userRepository } = params;
	const { sessionID, tag } = input;

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

	const tagSaved: TEntityAsync<IUserTag> = {
		id: generateID(),
		name: tag.name,
		displayName: tag.displayName,
		grantableBy: [],
	};
	await repository.save(tagSaved);

	const tagForOutput: TUserTagForPublic = {
		id: tagSaved.id,
		name: tagSaved.name,
		displayName: tagSaved.displayName,
		grantableBy: [],
	};
	const output: IUserTagCreateOutput = {
		tag: tagForOutput,
	};

	return output;
}
