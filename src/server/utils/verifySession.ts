import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { TEntityAsync } from '../TEntityAsync';
import { SbullasyError } from '../error/SbullasyError';
import { SessionInvalidError } from '../error/SessionInvalidError';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';

interface IVerifySessionParams {
	sessionID: string;
	userRepository: IUserRepository;
}

type TVerifySessionResult = {
	status: true;
	user: TEntityAsync<IUser>;
	error: undefined;
} | {
	status: false;
	user: undefined;
	error: SbullasyError;
}

const createVerifySessionErrorResult = (message: string): TVerifySessionResult => {
	const error = new SessionInvalidError({
		message: message,
	});
	const result = {
		status: false as const,
		user: undefined,
		error: error,
	}
	return result;
}

/**
 * Check whether the session is valid
 * @param param `IVerifySessionParams`
 * @returns `ISessionValidationResult`
 */
export const verifySession = async (param: IVerifySessionParams): Promise<TVerifySessionResult> => {
	const { sessionID, userRepository } = param;
	const user = await userRepository.findBySessionID(sessionID);
	const now = dateToUnixTimeMillis(new Date());

	if (!user) {
		const result = createVerifySessionErrorResult(`The session you've attached (sessionID: ${sessionID}) is invalid.`);
		return result;
	}

	const sessions = await user.sessions;
	const session = sessions.find((session) => {
		return session.id === sessionID;
	});

	if (!session) {
		const result = createVerifySessionErrorResult(`The session you've attached (sessionID: ${sessionID}) is invalid.`);
		return result;
	}

	const isExpired = session.expiresAt < now;

	if (isExpired) {
		const result = createVerifySessionErrorResult(`The session you've attached (sessionID: ${sessionID}) is expired.`);
		return result;
	}

	const result = {
		status: true as const,
		user: user,
		error: undefined,
	};

	return result;
}
