import { TEntityAsync } from '../TEntityAsync';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';

export const propertyToPropertyWithoutEntityKey = async (property: TEntityAsync<TProperty>): Promise<TEntityWithoutEntityKey<TProperty>> => {
	const value = await property.value;
	const propertyForOutput = {
		id: property.id,
		key: property.key,
		type: property.type,
		value: typeof value === 'string' ? value : value?.id,
	};
	return propertyForOutput;
}
