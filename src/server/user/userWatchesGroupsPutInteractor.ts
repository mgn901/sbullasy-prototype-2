import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IGroupRepository } from '../group/IGroupRepository';
import { IInteractorParams } from '../IInteractorParams';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesGroupsPutInput } from './IUserWatchesGroupsPutInput';
import { IUserWatchesGroupsPutOutput } from './IUserWatchesGroupsPutOutput';

interface IUserWatchesGroupsPutInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesGroupsPutInput,
	IUser
> {
	groupRepository: IGroupRepository;
}

export const userWatchesGroupsPutInteractor = async (params: IUserWatchesGroupsPutInteractorParams): Promise<IUserWatchesGroupsPutOutput> => {
	const { repository, input, groupRepository } = params;

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
	const watchesGroups = await user.watchesGroups;
	const group = await groupRepository.findByID(input.groupID);
	if (!group) {
		const error = new NotFoundError({
			message: `The group ${input.groupID} is not found.`,
		});
		throw error;
	}

	watchesGroups.push(group);
	user.watchesGroups = watchesGroups;
	await repository.save(user);

	const output: IUserWatchesGroupsPutOutput = {};

	return output;
}
