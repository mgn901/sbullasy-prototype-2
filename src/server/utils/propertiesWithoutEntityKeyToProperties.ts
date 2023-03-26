import { EntityAsync } from '../EntityAsync';
import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IGroupRepository } from '../group/IGroupRepository';
import { createProperty } from '../kysely/createProperty.kysely';
import { IPageRepository } from '../page/IPageRepository';
import { TProperty } from '../property/TProperty';
import { IUserRepository } from '../user/IUserRepository';

interface IPropertyWithoutEntityKeyToPropertiesParams {
	propertiesPartial: EntityWithoutEntityKey<TProperty>[];
	userRepository: IUserRepository;
	groupRepository: IGroupRepository;
	pageRepository: IPageRepository;
}

export const propertiesWithoutEntityKeyToProperties = (params: IPropertyWithoutEntityKeyToPropertiesParams): Promise<EntityAsync<TProperty>[]> => {
	const { propertiesPartial, userRepository, groupRepository, pageRepository } = params;

	const propertyPromises = propertiesPartial.map(async (propertyPartial) => {
		const type = propertyPartial.type;
		const valueID = propertyPartial.value;
		const property: EntityAsync<TProperty> = {
			id: propertyPartial.id,
			key: propertyPartial.key,
			type: type,
			value: undefined,
		};
		if (!valueID) {
			return property;
		}
		if (type === 'plain') {
			property.value = propertyPartial.value;
		} else if (type === 'user') {
			property.value = await userRepository.findByID(valueID);
		} else if (type === 'group') {
			property.value = await groupRepository.findByID(valueID);
		} else {
			property.value = await pageRepository.findByID(valueID);
		}
		return property;
	});

	const properties = Promise.all(propertyPromises);

	return properties;
}
