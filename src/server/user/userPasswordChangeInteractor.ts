import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { hashPassword } from '../utils/hashPassword.argon2';
import { promisedMap } from '../utils/promisedMap';
import { propertyToPropertyWithoutEntityKey } from '../utils/propertyToPropertyWithoutEntityKey';
import { userTagRegistrationToUserTagWithExpiresAt } from '../utils/userTagRegistrationToUserTagWithExpiresAt';
import { verifyPassword } from '../utils/verifyPassword.argon2';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserPasswordChangeInput } from './IUserPasswordChangeInput';
import { IUserPasswordChangeOutput } from './IUserPasswordChangeOutput';
import { IUserRepository } from './IUserRepository';

interface IUserPasswordChangeInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserPasswordChangeInput,
	IUser
> { }

export const userPasswordChangeInteractor = async (params: IUserPasswordChangeInteractorParams): Promise<IUserPasswordChangeOutput> => {
	const { repository, input } = params;

	const verifySessionResult = await verifySession({
		userID: input.userID,
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}

	const verifyPasswordResult = await verifyPassword({
		userID: input.userID,
		password: input.oldPassword,
		userRepository: repository,
	});
	if (!verifyPasswordResult.status) {
		throw verifyPasswordResult.error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}
	const hashedNewPassword = await hashPassword(input.newPassword);

	user.password = hashedNewPassword;
	await repository.save(user);

	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await user.properties);
	const tags = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, await user.tagRegistrations);
	const output: IUserPasswordChangeOutput = {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		properties: properties,
		tags: tags,
	};

	return output;
}
