import { EntityAsync } from '../EntityAsync';
import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';

export const propertyToPropertyWithoutEntityKey = async (property: EntityAsync<TProperty>): Promise<EntityWithoutEntityKey<TProperty>> => {
	const value = await property.value;
	const propertyForOutput = {
		id: property.id,
		key: property.key,
		type: property.type,
		value: typeof value === 'string' ? value : value?.id,
	};
	return propertyForOutput;
}
