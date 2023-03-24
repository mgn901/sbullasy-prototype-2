import { EntityAsync } from '../EntityAsync';
import { IPage } from '../page/IPage';
import { TPageForPublic } from '../page/TPageForPublic';
import { groupToGroupForPublic } from './groupToGroupForPublic';
import { promisedMap } from './promisedMap';
import { propertyToPropertyWithoutEntityKey } from './propertyToPropertyWithoutEntityKey';
import { tagToTagWithoutEntityKey } from './tagToTagWithoutEntityKey';
import { userToUserForPublic } from './userToUserForPublic';

export const pageToPageForPublic = async (page: EntityAsync<IPage>): Promise<TPageForPublic> => {
	const createdByUser = await page.createdByUser;
	const createdByUserForOutput = createdByUser ? await userToUserForPublic(createdByUser) : undefined;
	const createdByGroup = await page.createdByGroup;
	const createdByGroupForOutput = createdByGroup ? await groupToGroupForPublic(createdByGroup) : undefined;
	const places = await page.places;
	const tags = await promisedMap(tagToTagWithoutEntityKey, await page.tags);
	const properties = await promisedMap(propertyToPropertyWithoutEntityKey, await page.properties);

	const pageForPublic: TPageForPublic = {
		id: page.id,
		name: page.name,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt,
		type: page.type,
		createdByUser: createdByUserForOutput,
		createdByGroup: createdByGroupForOutput,
		startsAt: page.startsAt,
		endsAt: page.endsAt,
		places: places,
		tags: tags,
		properties: properties,
	};

	return pageForPublic;
}
