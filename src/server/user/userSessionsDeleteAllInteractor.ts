import { IInteractorParams } from '../IInteractorParams';
import { PermissionError } from '../error/PermissionError';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsDeleteAllInput } from './IUserSessionsDeleteAllInput';
import { IUserSessionsDeleteAllOutput } from './IUserSessionsDeleteAllOutput';

interface IUserSessionsDeleteAllInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsDeleteAllInput,
	IUser
> { }

export const userSessionsDeleteAllInteractor = async (params: IUserSessionsDeleteAllInteractorParams): Promise<IUserSessionsDeleteAllOutput> => {
	const { repository, input } = params;
	const { sessionID, userID } = input;
	
	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== input.userID) {
		const error = new PermissionError({
			message: `You are not allowed to delete the specified user (userID: ${userID}).`,
		});
		throw error;
	}

	const user = verifySessionResult.user;
	user.sessions = [];
	await repository.save(user);

	const output: IUserSessionsDeleteAllOutput = {};

	return output;
}
