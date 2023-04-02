import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { TEntityAsync } from '../TEntityAsync';
import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { RequestExpiredError } from '../error/RequestExpiredError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserTagRequestRepository } from '../user-tag-request/IUserTagRequestRepository';
import { IUserTagRepository } from '../user-tag/IUserTagRepository';
import { generateID } from '../utils/generateID.node';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserTagRegistration } from './IUserTagRegistration';
import { IUserTagsPutInput } from './IUserTagsPutInput';
import { IUserTagsPutOutput } from './IUserTagsPutOutput';

interface IUserTagsPutInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserTagsPutInput,
	IUser
> {
	requestRepository: IUserTagRequestRepository;
	tagRepository: IUserTagRepository;
}

export const userTagsPutInteractor = async (params: IUserTagsPutInteractorParams): Promise<IUserTagsPutOutput> => {
	const { repository, input, requestRepository, tagRepository } = params;

	const verifySessionResult = await verifySession({
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== input.userID) {
		const error = new PermissionError({
			message: `You are not allowed to edit the specified user (userID: ${input.userID}).`,
		});
		throw error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}
	const tagRegistrations = await user.tagRegistrations;
	const tagIDsUserHas = tagRegistrations.map(tag => tag.id);
	const tagBeGranted = await tagRepository.findByID(input.tagID);
	if (!tagBeGranted) {
		const error = new NotFoundError({
			message: `The tag ${input.tagID} is not found.`,
		});
		throw error;
	}
	const grantableBy = await tagBeGranted.grantableBy;
	const now = dateToUnixTimeMillis(new Date());

	if (input.reason) {
		const isReasonForgery = !tagIDsUserHas.includes(input.reason);
		const isReasonUnableToGrant = !grantableBy.find(async (grantability) => {
			const tagAbleToGrant = await grantability.tag;
			return tagAbleToGrant.id === input.reason;
		});

		if (isReasonForgery) {
			const error = new WrongParamsError({
				message: `You don't have the tag (tagID: ${input.reason}).`,
			});
			throw error;
		}

		if (isReasonUnableToGrant) {
			const error = new WrongParamsError({
				message: `The tag you have (tagID: ${input.reason}) doesn't have the ability to grant you the tag (tagID: ${tagBeGranted.id}).`,
			});
			throw error;
		}

		const registrationID = generateID();
		const registration: TEntityAsync<IUserTagRegistration> = {
			id: registrationID,
			user: user,
			tag: tagBeGranted,
			expiresAt: undefined,
		};
		const registrations = await user.tagRegistrations;

		registrations.push(registration);
		user.tagRegistrations = registrations;
		await repository.save(user);

	} else if (input.requestToken) {
		const requestAttached = await requestRepository.findByToken(input.requestToken);
		if (!requestAttached) {
			const error = new NotFoundError({
				message: `The attached request (token: ${input.requestToken}) is not found.`,
			});
			throw error;
		}
		const userInRequestAttached = await requestAttached.user;
		const tagInRequestAttached = await requestAttached.tag;
		const isRequestWrong = user.id !== userInRequestAttached.id || tagInRequestAttached.id !== tagBeGranted.id;
		const isRequestExpired = requestAttached.createdAt + 10 * 60 * 1000 < now;

		if (isRequestWrong) {
			const error = new WrongParamsError({
				message: `The request you attached (requestID: ${requestAttached.id}) is not for granting you the tag (tagID: ${tagBeGranted.id}).`,
			});
			throw error;
		}

		if (isRequestExpired) {
			const error = new RequestExpiredError({
				message: `The request you attached (requestID: ${requestAttached.id}) is expired.`
			});
			throw error;
		}

		const grantabilityAttached = await requestAttached.grantability;
		const expiresAt = grantabilityAttached.expiresAt;
		const registrationID = generateID();
		const registration: TEntityAsync<IUserTagRegistration> = {
			id: registrationID,
			user: userInRequestAttached,
			tag: tagBeGranted,
			expiresAt: expiresAt,
		};
		const registrations = await user.tagRegistrations;

		registrations.push(registration);
		user.tagRegistrations = registrations;
		await repository.save(user);
		await requestRepository.deleteByID(requestAttached.id);
	}

	const output: IUserTagsPutOutput = {};

	return output;
}
