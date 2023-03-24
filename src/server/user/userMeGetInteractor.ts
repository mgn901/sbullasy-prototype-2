import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { promisedMap } from '../utils/promisedMap';
import { propertyToPropertyWithoutEntityKey } from '../utils/propertyToPropertyWithoutEntityKey';
import { userTagRegistrationToUserTagWithExpiresAt } from '../utils/userTagRegistrationToUserTagWithExpiresAt';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserMeGetInput } from './IUserMeGetInput';
import { IUserMeGetOutput } from './IUserMeGetOutput';
import { IUserRepository } from './IUserRepository';

interface IUserMeGetInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserMeGetInput,
	IUser
> { }

export const userMeGetInteractor = async (params: IUserMeGetInteractorParams): Promise<IUserMeGetOutput> => {
	const { repository, input } = params;

	const verifySessionResult = await verifySession({
		userID: input.userID,
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (verifySessionResult.status) {
		throw verifySessionResult.error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}

	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await user.properties);
	const tags = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, await user.tagRegistrations);
	const output: IUserMeGetOutput = {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		properties: properties,
		tags: tags,
	};

	return output;
}
