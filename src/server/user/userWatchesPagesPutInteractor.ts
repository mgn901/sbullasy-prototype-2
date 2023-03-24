import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { IPageRepository } from '../page/IPageRepository';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserWatchesPagesPutInput } from './IUserWatchesPagesPutInput';
import { IUserWatchesPagesPutOutput } from './IUserWatchesPagesPutOutput';

interface IUserWatchesPagesPutInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserWatchesPagesPutInput,
	IUser
> {
	pageRepository: IPageRepository;
}

export const userWatchesPagesPutInteractor = async (params: IUserWatchesPagesPutInteractorParams): Promise<IUserWatchesPagesPutOutput> => {
	const { repository, input, pageRepository } = params;

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
	const watchesPages = await user.watchesPages;
	const page = await pageRepository.findByID(input.pageID);
	if (!page) {
		const error = new NotFoundError({
			message: `The page ${input.pageID} is not found.`,
		});
		throw error;
	}

	watchesPages.push(page);
	user.watchesPages = watchesPages;
	await repository.save(user);

	const output: IUserWatchesPagesPutOutput = {};

	return output;
}
