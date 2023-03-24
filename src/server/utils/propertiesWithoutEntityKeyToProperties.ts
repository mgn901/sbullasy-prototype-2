import { EntityAsync } from '../EntityAsync';
import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IGroupRepository } from '../group/IGroupRepository';
import { IPageRepository } from '../page/IPageRepository';
import { IProperty } from '../property/IProperty';
import { IUserRepository } from '../user/IUserRepository';

interface IPropertyWithoutEntityKeyToPropertiesParams {
	propertiesPartial: EntityWithoutEntityKey<IProperty>[];
	userRepository: IUserRepository;
	groupRepository: IGroupRepository;
	pageRepository: IPageRepository;
}

export const propertiesWithoutEntityKeyToProperties = (params: IPropertyWithoutEntityKeyToPropertiesParams): Promise<EntityAsync<IProperty>[]> => {
	const { propertiesPartial, userRepository, groupRepository, pageRepository } = params;

	const propertyPromises = propertiesPartial.map(async (propertyPartial) => {
		const userID = propertyPartial.user;
		const groupID = propertyPartial.group;
		const pageID = propertyPartial.page;
		const propertyUser = userID ? await userRepository.findByID(userID) : undefined;
		const group = groupID ? await groupRepository.findByID(groupID) : undefined;
		const page = pageID ? await pageRepository.findByID(pageID) : undefined;
		const property = {
			id: propertyPartial.id,
			key: propertyPartial.key,
			value: propertyPartial.value,
			user: propertyUser,
			group: group,
			page: page,
		};
		return property;
	});

	const properties = Promise.all(propertyPromises);

	return properties;
}
