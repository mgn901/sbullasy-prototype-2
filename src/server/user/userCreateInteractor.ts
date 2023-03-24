import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { ISession } from '../session/ISession';
import { generateID } from '../utils/generateID.node';
import { hashPassword } from '../utils/hashPassword.argon2';
import { IUser } from './IUser';
import { IUserCreateInput } from './IUserCreateInput';
import { IUserCreateOutput } from './IUserCreateOutput';
import { IUserRepository } from './IUserRepository';

interface IUserCreateInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserCreateInput,
	IUser
> { }

export const userCreateInteractor = async (params: IUserCreateInteractorParams): Promise<IUserCreateOutput> => {
	const { repository, input } = params;

	const userID = generateID();
	const hashedPassword = await hashPassword(input.password);
	const sessionID = generateID();
	const sessionName = generateID();
	const loggedInAt = dateToUnixTimeMillis(new Date());
	const expiresAt = loggedInAt + 365 * 24 * 60 * 60 * 1000;

	const user: IUser = {
		id: userID,
		email: input.email,
		password: hashedPassword,
		displayName: input.displayName,
		sessions: [],
		tagRegistrations: [],
		properties: [],
		owns: [],
		belongs: [],
		watchesGroups: [],
		watchesPages: [],
		pages: [],
	};
	const session: ISession = {
		id: sessionID,
		loggedInAt: loggedInAt,
		expiresAt: expiresAt,
		ipAddress: input.ipAddress,
		user: user,
		name: sessionName,
	};
	user.sessions.push(session);
	await repository.save(user);

	const output: IUserCreateOutput = {
		id: userID,
		email: user.email,
		displayName: user.displayName,
		sessionID: sessionID,
		tags: [],
		properties: [],
	};

	return output;
}
