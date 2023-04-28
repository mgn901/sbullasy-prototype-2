import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IUserTag } from './IUserTag';
import { IUserTagPutInput } from './IUserTagPutInput';
import { IUserTagPutOutput } from './IUserTagPutOutput';
import { IUserTagRepository } from './IUserTagRepository';
import { userTagToUserTagForPublic } from './userTagToUserTagForPublic';

interface IUserTagPutInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagPutInput,
	IUserTag
> {
	userRepository: IUserRepository;
}

export const userTagPutInteractor = async (params: IUserTagPutInteractorParams): Promise<IUserTagPutOutput> => {
	const { repository, input, userRepository } = params;
	const sessionID = input.sessionID;
	const tagPartial = input.tag;
	let tag = await repository.findByID(tagPartial.id);

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

	if (!tag) {
		tag = {
			id: tagPartial.id,
			name: tagPartial.name,
			displayName: tagPartial.displayName,
			grantableBy: [],
		};
	}
	tag.name = tagPartial.name;
	tag.displayName = tagPartial.displayName;
	await repository.save(tag);

	const tagForOutput = await userTagToUserTagForPublic(tag);
	const output: IUserTagPutOutput = {
		tag: tagForOutput,
	};

	return output;
}
