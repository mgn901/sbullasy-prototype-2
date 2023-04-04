import { TEntityAsync } from '../TEntityAsync';
import { IGroup } from '../group/IGroup';
import { TGroupForPublic } from '../group/TGroupForPublic';
import { promisedMap } from './promisedMap';
import { propertyToPropertyWithoutEntityKey } from './propertyToPropertyWithoutEntityKey';
import { tagToTagWithoutEntityKey } from './tagToTagWithoutEntityKey';

export const groupToGroupForPublic = async (group: TEntityAsync<IGroup>): Promise<TGroupForPublic> => {
	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await group.properties);
	const tags = await promisedMap(tagToTagWithoutEntityKey, await group.tags);

	const groupForPublic: TGroupForPublic = {
		id: group.id,
		name: group.name,
		properties: properties,
		tags: tags,
	};

	return groupForPublic;
}
