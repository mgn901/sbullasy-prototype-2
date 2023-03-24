import { Entity } from '../Entity';
import { EntityAsync } from '../EntityAsync';

export const promisedMap = <
	From extends EntityAsync<Entity>,
	To extends {}
>(
	callback: (item: From) => Promise<To> | To,
	list: From[],
): Promise<To[]> => {
	const forPublicPromises: Promise<To>[] = list.map(async (item) => {
		const itemForPublic = await callback(item);
		return itemForPublic;
	});
	const forPublicList = Promise.all(forPublicPromises);
	return forPublicList;
}
