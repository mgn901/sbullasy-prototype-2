import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { TEntityAsync } from '../TEntityAsync';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { IEmail } from '../email/IEmail';
import { IEmailClient } from '../email/IEmailClient';
import { ISettingItemRepository } from '../setting/ISettingItemRepository';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';
import { ableToResendEmail } from '../utils/ableToResendEmail';
import { generateID } from '../utils/generateID.node';
import { generateToken } from '../utils/generateToken.node';
import { parseTemplate } from '../utils/parseTemplate';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateInput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateInput';
import { IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput } from './IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput';

interface IUserCreateIfNotExistsAndCreateSessionRequestCreateInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserCreateIfNotExistsAndCreateSessionRequestCreateInput,
	IUser
> {
	emailClient: IEmailClient,
	settingItemRepository: ISettingItemRepository;
}

export const userCreateIfNotExistsAndCreateSessionRequestCreateInteractor = async (params: IUserCreateIfNotExistsAndCreateSessionRequestCreateInteractorParams): Promise<IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput> => {
	const { repository, input, emailClient } = params;

	const now = dateToUnixTimeMillis(new Date());
	const userPartial = input.user;
	const userInDB = await repository.findByEmail(userPartial.email);
	const user = userInDB ?? (() => {
		const userID = generateID();
		const user: IUser = {
			id: userID,
			email: userPartial.email,
			displayName: userPartial.email,
			createdAt: now,
			ipAddress: userPartial.ipAddress,
			isOnboarded: false,
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
		return user;
	})();

	const requests = await user.createSessionRequests;
	const requestTimeList = requests.map(request => request.createdAt);
	const ableToResendEmailResult = ableToResendEmail(requestTimeList, now);
	if (ableToResendEmailResult.status === false) {
		throw ableToResendEmailResult.error;
	}

	requests.forEach((request) => {
		request.isDisposed = true;
	});
	const request: TEntityAsync<ICreateSessionRequest> = {
		id: generateID(),
		token: generateToken(),
		createdAt: now,
		user: user,
		isDisposed: false,
	};
	requests.push(request);
	await repository.save(user);

	const email: IEmail = await (async () => {
		if (user.isOnboarded) {
			const subjectTemplate = (await params.settingItemRepository.findByID('sbullasy.settings.templates.userCreateSubject')).value;
			const bodyTemplate = (await params.settingItemRepository.findByID('sbullasy.settings.templates.userCreateBody')).value;
			const email: IEmail = {
				to: user.email,
				subject: parseTemplate(subjectTemplate)({}),
				body: parseTemplate(bodyTemplate)({ token: request.token, email: user.email }),
			};
			return email;
		} else {
			const subjectTemplate = (await params.settingItemRepository.findByID('sbullasy.settings.templates.createSessionRequestCreateSubject')).value;
			const bodyTemplate = (await params.settingItemRepository.findByID('sbullasy.settings.templates.createSessionRequestCreateBody')).value;
			const email: IEmail = {
				to: user.email,
				subject: parseTemplate(subjectTemplate)({}),
				body: parseTemplate(bodyTemplate)({ token: request.token, email: user.email }),
			};
			return email;
		}
	})();
	await emailClient.send(email);

	const output: IUserCreateIfNotExistsAndCreateSessionRequestCreateOutput = {};

	return output;
}
