import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateInput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateInput';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput';
import { generateID } from '../utils/generateID.node';
import { TEntityAsync } from '../TEntityAsync';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { generateToken } from '../utils/generateToken.node';

interface IUserCreateIfNotExistsAndCreateSessionRequestCreateInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserCreateIfNotExistsAndCreateSessionRequestCreateInput,
	IUser
> { }

export const userCreateIfNotExistsAndCreateSessionRequestCreateInteractor = async (params: IUserCreateIfNotExistsAndCreateSessionRequestCreateInteractorParams): Promise<IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput> => {
	const { repository, input } = params;
	
	const now = dateToUnixTimeMillis(new Date());
	const userPartial = input.user;
	let user = await repository.findByEmail(userPartial.email);

	if (!user) {
		const userID = generateID();
		user = {
			id: userID,
			email: userPartial.email,
			displayName: userPartial.email,
			createdAt: now,
			ipAddress: userPartial.ipAddress,
			sessions: [],
			createSessionRequests: [],
			tagRegistrations: [],
			properties: [],
			owns: [],
			belongs: [],
			watchesGroups: [],
			watchesPages: [],
			pages: [],
			apiTokens: [],
		};
	}

	const request: TEntityAsync<ICreateSessionRequest> = {
		id: generateID(),
		token: generateToken(),
		createdAt: now,
		user: user,
		isDisposed: false,
	};
	const requests = await user.createSessionRequests;
	requests.push(request);
	await repository.save(user);

	// メールを送る

	const output: IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput = {};

	return output;
}
