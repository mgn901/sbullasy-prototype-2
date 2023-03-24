import { NotFoundError } from '../error/NotFoundError';
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

	const verifySessionResult = await verifySession({
		userID: input.userID,
		sessionID: input.sessionID,
		userRepository: repository,
	});
	if (!verifySessionResult.status) {
		throw verifySessionResult.error;
	}

	const user = await repository.findByID(input.userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${input.userID} is not found.`,
		});
		throw error;
	}

	const tagRegistrations = await user.tagRegistrations;
	const propertiesPartial = input.properties;
	const properties = await propertiesWithoutEntityKeyToProperties({
		propertiesPartial: propertiesPartial,
		userRepository: repository,
		groupRepository: groupRepository,
		pageRepository: pageRepository,
	});

	user.displayName = input.displayName;
	user.properties = properties;
	await repository.save(user);

	const propertiesForOutput = await promisedMap(propertyToPropertyWithoutEntityKey, properties);
	const tagsForOutput = await promisedMap(userTagRegistrationToUserTagWithExpiresAt, tagRegistrations);
	const output: IUserEditOutput = {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		properties: propertiesForOutput,
		tags: tagsForOutput,
	};

	return output;
}
