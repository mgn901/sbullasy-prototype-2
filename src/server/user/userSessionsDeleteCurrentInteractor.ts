import { IInteractorParams } from '../IInteractorParams';
import { NotFoundError } from '../error/NotFoundError';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsDeleteCurrentInput } from './IUserSessionsDeleteCurrentInput';
import { IUserSessionsDeleteCurrentOutput } from './IUserSessionsDeleteCurrentOutput';

interface IUserSessionsDeleteCurrentInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsDeleteCurrentInput,
	IUser
> { }

export const userSessionsDeleteCurrentInteractor = async (params: IUserSessionsDeleteCurrentInteractorParams): Promise<IUserSessionsDeleteCurrentOutput> => {
	const { repository, input } = params;
	const sessionID = input.sessionID;

	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	const user = verifySessionResult.user;
	const sessions = await user.sessions;
	const currentSessionIDX = sessions.findIndex((session) => {
		return session.id === sessionID;
	});
	if (currentSessionIDX === -1) {
		const error = new NotFoundError({
			message: `The session you attached is not found.`,
		});
		throw error;
	}
	sessions.splice(currentSessionIDX, 1);
	user.sessions = sessions;
	await repository.save(user);

	const output: IUserSessionsDeleteCurrentOutput = {};

	return output;
}
