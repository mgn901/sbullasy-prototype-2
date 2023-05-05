import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { WrongParamsError } from '../error/WrongParamsError';
import { ISession } from '../session/ISession';
import { generateID } from '../utils/generateID.node';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsCreateInput } from './IUserSessionsCreateInput';
import { IUserSessionsCreateOutput } from './IUserSessionsCreateOutput';

interface IUserSessionsCreateInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsCreateInput,
	IUser
> {}

export const userSessionsCreateInteractor = async (params: IUserSessionsCreateInteractorParams): Promise<IUserSessionsCreateOutput> => {
	const { repository, input } = params;
	const { email, ipAddress, createSessionRequestToken } = input;

	const user = await repository.findByEmail(email);
	const now = dateToUnixTimeMillis(new Date());
	if (!user) {
		const error = new WrongParamsError({
			message: `Email and/or token are incorrect.`,
		});
		throw error;
	}
	const sessionRequests = await user.createSessionRequests;
	const request = sessionRequests.find((request) => {
		return !(request.isDisposed)
			&& request.token === createSessionRequestToken;
	});
	if (!request || request.createdAt + 5 * 60 * 1000 < now) {
		const error = new WrongParamsError({
			message: `Email and/or token are incorrect.`,
		});
		throw error;
	}

	const expiresAt = now + 4 * 365 * 24 * 60 * 60 * 1000;
	const session: TEntityAsync<ISession> = {
		id: generateID(),
		name: generateID(),
		user: user,
		ipAddress: ipAddress,
		loggedInAt: now,
		expiresAt: expiresAt,
	};
	const sessions = await user.sessions;
	sessions.push(session);
	user.sessions = sessions;
	user.createSessionRequests = [];
	await repository.save(user);

	const output: IUserSessionsCreateOutput = {
		sessionID: session.id,
		expiresAt: session.expiresAt,
		userID: user.id,
	};

	return output;
}
