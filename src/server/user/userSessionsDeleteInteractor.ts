import { IInteractorParams } from '../IInteractorParams';
import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsDeleteInput } from './IUserSessionsDeleteInput';
import { IUserSessionsDeleteOutput } from './IUserSessionsDeleteOutput';

interface IUserSessionsDeleteInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsDeleteInput,
	IUser
> { }

export const userSessionsDeleteInteractor = async (params: IUserSessionsDeleteInteractorParams): Promise<IUserSessionsDeleteOutput> => {
	const { repository, input } = params;
	const { sessionID, userID, sessionName } = input;
	
	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: repository,
	});
	if (!(verifySessionResult.status)) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== input.userID) {
		const error = new PermissionError({
			message: `You are not allowed to delete the specified user (userID: ${userID}).`,
		});
		throw error;
	}

	const user = verifySessionResult.user;
	const sessions = await user.sessions;
	const sessionIdx = sessions.findIndex((session) => {
		return session.name === sessionName;
	});
	if (sessionIdx === -1) {
		const error = new NotFoundError({
			message: `The session (sessionName: ${sessionName}) is not found`,
		});
		throw error;
	}
	sessions.splice(sessionIdx, 1);
	user.sessions = sessions;
	await repository.save(user);

	const output: IUserSessionsDeleteOutput = {};

	return output;
}
