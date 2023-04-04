import { IInteractorParams } from '../IInteractorParams';
import { PermissionError } from '../error/PermissionError';
import { sessionToSessionForPublic } from '../session/sessionToSessionWithoutID';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsGetAllInput } from './IUserSessionsGetAllInput';
import { IUserSessionsGetAllOutput } from './IUserSessionsGetAllOutput';

interface IUserSessionsGetAllInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsGetAllInput,
	IUser
> { }

export const userSessionsGetAllInteractor = async (params: IUserSessionsGetAllInteractorParams): Promise<IUserSessionsGetAllOutput> => {
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
	const sessions = await user.sessions;
	const sessionsForOutput = sessions.map(sessionToSessionForPublic);
	const output: IUserSessionsGetAllOutput = {
		sessions: sessionsForOutput,
	};

	return output;
}
