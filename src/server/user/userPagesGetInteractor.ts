import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { pageToPageForPublic } from '../utils/pageToPageForPublic';
import { promisedMap } from '../utils/promisedMap';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserPagesGetInput } from './IUserPagesGetInput';
import { IUserPagesGetOutput } from './IUserPagesGetOutput';
import { IUserRepository } from './IUserRepository';

interface IUserPagesGetInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserPagesGetInput,
	IUser
> { }

export const userPagesGetInteractor = async (params: IUserPagesGetInteractorParams): Promise<IUserPagesGetOutput> => {
	const { repository, input } = params;

	const verifySessionResult = await verifySession({
		userID: input.userID,
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (verifySessionResult.status) {
		throw verifySessionResult.error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}
	const pages = await user.pages;

	const pagesForOutput = await promisedMap(pageToPageForPublic, pages);
	const output: IUserPagesGetOutput = {
		id: user.id,
		pages: pagesForOutput,
	};

	return output;
}
