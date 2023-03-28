import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IInteractorParams } from '../IInteractorParams';
import { groupToGroupForPublic } from '../utils/groupToGroupForPublic';
import { promisedMap } from '../utils/promisedMap';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesGroupsGetInput } from './IUserWatchesGroupsGetInput';
import { IUserWatchesGroupsGetOutput } from './IUserWatchesGroupsGetOutput';

interface IUserWatchesGroupsGetInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesGroupsGetInput,
	IUser
> { }

export const userWatchesGroupsGetInteractor = async (params: IUserWatchesGroupsGetInteractorParams): Promise<IUserWatchesGroupsGetOutput> => {
	const { repository, input } = params;

	const verifySessionResult = await verifySession({
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== input.userID) {
		const error = new PermissionError({
			message: `You are not allowed to edit the specified user (userID: ${input.userID}).`,
		});
		throw error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}

	const groups = await promisedMap(groupToGroupForPublic, await user.watchesGroups);
	const output: IUserWatchesGroupsGetOutput = {
		id: user.id,
		watchesGroups: groups,
	};

	return output;
}
