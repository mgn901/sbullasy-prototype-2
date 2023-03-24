import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { NotFoundError } from '../error/NotFoundError';
import { SbullasyError } from '../error/SbullasyError';
import { SessionExpiredError } from '../error/SessionExpiredError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';

interface IVerifySessionParams {
	userID: string;
	sessionID: string;
	userRepository: IUserRepository;
}

type TVerifySessionResult = {
	status: true;
	error: undefined;
} | {
	status: false;
	error: SbullasyError;
}

/**
 * Check whether the session is valid
 * @param param `IVerifySessionParams`
 * @returns `ISessionValidationResult`
 */
export const verifySession = async (param: IVerifySessionParams): Promise<TVerifySessionResult> => {
	const { userID, sessionID, userRepository } = param;
	const user = await userRepository.findByID(userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${userID} is not found.`,
		});
		throw error;
	}
	const sessions = await user.sessions;
	const session = sessions.find((session) => {
		return session.id === sessionID;
	});
	const now = dateToUnixTimeMillis(new Date());

	if (!session) {
		const error = new WrongParamsError({
			message: '"userID" or "sessionID" is wrong.',
		});
		const result = {
			status: false as const,
			error: error,
		};
		return result;
	}

	const isExpired = session.expiresAt < now;
	if (isExpired) {
		const error = new SessionExpiredError({
			message: 'Your session is expired.',
		});
		const result = {
			status: false as const,
			error: error,
		};
		return result;
	}

	const result = {
		status: true as const,
		error: undefined,
	};

	return result;
}
