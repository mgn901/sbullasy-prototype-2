import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IInteractorParams } from '../IInteractorParams';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesPagesDeleteInput } from './IUserWatchesPagesDeleteInput';
import { IUserWatchesPagesDeleteOutput } from './IUserWatchesPagesDeleteOutput';

interface IUserWatchesPagesDeleteInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesPagesDeleteInput,
	IUser
> { }

export const userWatchesPagesDeleteInteractor = async (params: IUserWatchesPagesDeleteInteractorParams): Promise<IUserWatchesPagesDeleteOutput> => {
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
	const watchesPages = await user.watchesPages;
	const deletedPageIdx = watchesPages.findIndex((page) => {
		return page.id === input.pageID;
	});
	if (deletedPageIdx === -1) {
		const error = new NotFoundError({
			message: `The page (pageID: ${input.pageID}) is not found in your watch list.`,
		});
		throw error;
	}

	watchesPages.splice(deletedPageIdx, 1);
	user.watchesPages = watchesPages;
	await repository.save(user);

	const output: IUserWatchesPagesDeleteOutput = {};

	return output;
}
