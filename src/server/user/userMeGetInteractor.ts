import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IInteractorParams } from '../IInteractorParams';
import { groupToGroupForPublic } from '../utils/groupToGroupForPublic';
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
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!(verifySessionResult.status)) {
		throw verifySessionResult.error;
	}

	const user = verifySessionResult.user;
	const owns = await promisedMap(groupToGroupForPublic, await user.owns);
	const belongs = await promisedMap(groupToGroupForPublic, await user.belongs);
	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await user.properties);
	const tags = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, await user.tagRegistrations);
	const output: IUserMeGetOutput = {
		user: {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			properties: properties,
			tags: tags,
			owns: owns,
			belongs: belongs,
		},
	};

	return output;
}
