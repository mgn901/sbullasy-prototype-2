import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesGroupsDeleteInput } from './IUserWatchesGroupsDeleteInput';
import { IUserWatchesGroupsDeleteOutput } from './IUserWatchesGroupsDeleteOutput';

interface IUserWatchesGroupsDeleteInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesGroupsDeleteInput,
	IUser
> { }

export const userWatchesGroupsDeleteInteractor = async (params: IUserWatchesGroupsDeleteInteractorParams): Promise<IUserWatchesGroupsDeleteOutput> => {
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
	const watchesGroups = await user.watchesGroups;
	const deletedGroupIdx = watchesGroups.findIndex((group) => {
		return group.id === input.groupID;
	});
	if (deletedGroupIdx !== -1) {
		const error = new NotFoundError({
			message: `The group (groupID: ${input.groupID}) is not found in your watch list.`,
		});
		throw error;
	}

	watchesGroups.splice(deletedGroupIdx, 1);
	user.watchesGroups = watchesGroups;
	await repository.save(user);

	const output: IUserWatchesGroupsDeleteOutput = {};

	return output;
}
