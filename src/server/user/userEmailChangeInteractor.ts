import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { TEntityAsync } from '../TEntityAsync';
import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUndoChangeEmailRequest } from '../undo-change-email-request/IUndoChangeEmailRequest';
import { IUndoChangeEmailRequestRepository } from '../undo-change-email-request/IUndoChangeEmailRequestRepository';
import { generateID } from '../utils/generateID.node';
import { isEmail } from '../utils/isEmail';
import { isEmailNotInUse } from '../utils/isEmailNotInUse';
import { promisedMap } from '../utils/promisedMap';
import { propertyToPropertyWithoutEntityKey } from '../utils/propertyToPropertyWithoutEntityKey';
import { userTagRegistrationToUserTagWithExpiresAt } from '../utils/userTagRegistrationToUserTagWithExpiresAt';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserEmailChangeInput } from './IUserEmailChangeInput';
import { IUserEmailChangeOutput } from './IUserEmailChangeOutput';
import { IUserRepository } from './IUserRepository';

interface IUserEmailChangeInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserEmailChangeInput,
	IUser
> {
	requestRepository: IUndoChangeEmailRequestRepository;
}

export const userEmailChangeInteractor = async (params: IUserEmailChangeInteractorParams): Promise<IUserEmailChangeOutput> => {
	const { repository, input, requestRepository } = params;

	const verifySessionResult = await verifySession({
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!(verifySessionResult.status)) {
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
	const oldEmail = user.email;
	const newEmail = input.email;

	const isEmailResult = isEmail(newEmail);
	if (!isEmailResult) {
		const error = new WrongParamsError({
			message: '"email" is not a valid email address.',
		});
		throw error;
	}

	const isEmailNotInUseResult = await isEmailNotInUse({
		email: newEmail,
		userRepository: repository,
	});
	if (!(isEmailNotInUseResult.status)) {
		const error = isEmailNotInUseResult.error;
		throw error;
	}

	user.email = newEmail;
	await repository.save(user);

	const requestID = generateID();
	const now = dateToUnixTimeMillis(new Date());
	const request: TEntityAsync<IUndoChangeEmailRequest> = {
		id: requestID,
		email: oldEmail,
		createdAt: now,
		user: user,
	};
	await requestRepository.save(request);

	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await user.properties);
	const tags = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, await user.tagRegistrations);
	const output: IUserEmailChangeOutput = {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		properties: properties,
		tags: tags,
	};

	return output;
}
