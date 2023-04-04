import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { WrongParamsError } from '../error/WrongParamsError';
import { ISession } from '../session/ISession';
import { generateID } from '../utils/generateID.node';
import { hashPassword } from '../utils/hashPassword.argon2';
import { verifyPassword } from '../utils/verifyPassword.argon2';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserSessionsCreateInput } from './IUserSessionsCreateInput';
import { IUserSessionsCreateOutput } from './IUserSessionsCreateOutput';

interface IUserSessionsCreateInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserSessionsCreateInput,
	IUser
> { }

export const userSessionsCreateInteractor = async (params: IUserSessionsCreateInteractorParams): Promise<IUserSessionsCreateOutput> => {
	const { repository, input } = params;
	const { email, password, ipAddress } = input;

	const user = await repository.findByEmail(email);
	if (!user) {
		const hashedPassword = await hashPassword(password);
		const error = new WrongParamsError({
			message: `Email and/or password are incorrect.`,
		});
		throw error;
	}
	const verifyPasswordResult = await verifyPassword({
		userID: user.id,
		password: password,
		userRepository: repository,
	});
	if (!verifyPasswordResult.status) {
		throw verifyPasswordResult.error;
	}

	const now = dateToUnixTimeMillis(new Date());
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
	await repository.save(user);

	const output: IUserSessionsCreateOutput = {
		sessionID: session.id,
		userID: user.id,
	};

	return output;
}
