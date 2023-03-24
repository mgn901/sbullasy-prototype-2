import { NotFoundError } from '../error/NotFoundError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserTagsDeleteInput } from './IUserTagsDeleteInput';
import { IUserTagsDeleteOutput } from './IUserTagsDeleteOutput';

interface IUserTagsDeleteInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserTagsDeleteInput,
	IUser
> { }

export const userTagsDeleteInteractor = async (params: IUserTagsDeleteInteractorParams): Promise<IUserTagsDeleteOutput> => {
	const { repository, input } = params;

	const verifySessionResult = await verifySession({
		userID: input.userID,
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}
	const tagRegistrations = await user.tagRegistrations;
	const tagRegistrationIdx = tagRegistrations.findIndex(async (tagRegistration) => {
		const registeredTag = await tagRegistration.tag;
		return registeredTag.id === input.tagID;
	});

	if (tagRegistrationIdx === -1) {
		const error = new NotFoundError({
			message: `You don't have the tag (tagID: ${input.tagID}`,
		});
		throw error;
	}

	tagRegistrations.splice(tagRegistrationIdx, 1);
	user.tagRegistrations = tagRegistrations;
	await repository.save(user);

	const output: IUserTagsDeleteOutput = {};

	return output;
}
