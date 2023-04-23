import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';
import { ableToResendEmail } from '../utils/ableToResendEmail';
import { generateID } from '../utils/generateID.node';
import { generateToken } from '../utils/generateToken.node';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateInput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateInput';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput';

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

	const requests = await user.createSessionRequests;
	const requestTimeList = requests.map(request => request.createdAt);
	const ableToResendEmailResult = ableToResendEmail(requestTimeList, now);
	if (ableToResendEmailResult.status === false) {
		throw ableToResendEmailResult.error;
	}

	const request: TEntityAsync<ICreateSessionRequest> = {
		id: generateID(),
		token: generateToken(),
		createdAt: now,
		user: user,
		isDisposed: false,
	};
	requests.push(request);
	await repository.save(user);

	// メールを送る

	const output: IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput = {};

	return output;
}
