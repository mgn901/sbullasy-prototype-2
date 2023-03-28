import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IInteractorParams } from '../IInteractorParams';
import { pageToPageForPublic } from '../utils/pageToPageForPublic';
import { promisedMap } from '../utils/promisedMap';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesPagesGetInput } from './IUserWatchesPagesGetInput';
import { IUserWatchesPagesGetOutput } from './IUserWatchesPagesGetOutput';

interface IUserWatchesPagesGetInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesPagesGetInput,
	IUser
> { }

export const userWatchesPagesGetInteractor = async (params: IUserWatchesPagesGetInteractorParams): Promise<IUserWatchesPagesGetOutput> => {
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
			message: `You are not allowed to get information about the specified user (userID: ${input.userID}).`,
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
	const pages = await promisedMap(pageToPageForPublic, await user.pages);

	const output: IUserWatchesPagesGetOutput = {
		id: user.id,
		watchesPages: pages,
	};

	return output;
}
