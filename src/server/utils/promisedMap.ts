import { TEntity } from '../TEntity';
import { TEntityAsync } from '../TEntityAsync';

export const promisedMap = <
	From extends TEntityAsync<TEntity>,
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
