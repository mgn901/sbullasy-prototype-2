import { NotFoundError } from '../error/NotFoundError';
import { PermissionError } from '../error/PermissionError';
import { IGroupRepository } from '../group/IGroupRepository';
import { IInteractorParams } from '../IInteractorParams';
import { IPageRepository } from '../page/IPageRepository';
import { promisedMap } from '../utils/promisedMap';
import { propertiesWithoutEntityKeyToProperties } from '../utils/propertiesWithoutEntityKeyToProperties';
import { propertyToPropertyWithoutEntityKey } from '../utils/propertyToPropertyWithoutEntityKey';
import { userTagRegistrationToUserTagWithExpiresAt } from '../utils/userTagRegistrationToUserTagWithExpiresAt';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserEditInput } from './IUserEditInput';
import { IUserEditOutput } from './IUserEditOutput';
import { IUserRepository } from './IUserRepository';

interface IUserEditInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserEditInput,
	IUser
> {
	groupRepository: IGroupRepository;
	pageRepository: IPageRepository;
}

export const userEditInteractor = async (params: IUserEditInteractorParams): Promise<IUserEditOutput> => {
	const { input, repository, groupRepository, pageRepository } = params;
	const userPartial = input.user;

	const verifySessionResult = await verifySession({
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== userPartial.id) {
		const error = new PermissionError({
			message: `You are not allowed to edit the specified user (userID: ${userPartial.id}).`,
		});
		throw error;
	}

	const user = await repository.findByID(userPartial.id);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${userPartial.id} is not found.`,
		});
		throw error;
	}

	const tagRegistrations = await user.tagRegistrations;
	const propertiesPartial = userPartial.properties;
	const properties = await propertiesWithoutEntityKeyToProperties({
		propertiesPartial: propertiesPartial,
		userRepository: repository,
		groupRepository: groupRepository,
		pageRepository: pageRepository,
	});

	user.displayName = userPartial.displayName;
	user.properties = properties;
	await repository.save(user);

	const propertiesForOutput = await promisedMap(propertyToPropertyWithoutEntityKey, properties);
	const tagsForOutput = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, tagRegistrations);
	const output: IUserEditOutput = {
		user: {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			properties: propertiesForOutput,
			tags: tagsForOutput,
		},
	};

	return output;
}
