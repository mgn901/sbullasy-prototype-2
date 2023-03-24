import { EntityAsync } from '../EntityAsync';
import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IProperty } from '../property/IProperty';

export const propertyToPropertyWithoutEntityKey = async (property: EntityAsync<IProperty>): Promise<EntityWithoutEntityKey<IProperty>> => {
	const user = await property.user;
	const group = await property.group;
	const page = await property.page;
	const userID = user?.id;
	const groupID = group?.id;
	const pageID = page?.id;
	const propertyForOutput = {
		id: property.id,
		key: property.key,
		value: property.value,
		user: userID,
		group: groupID,
		page: pageID,
	};
	return propertyForOutput;
}
