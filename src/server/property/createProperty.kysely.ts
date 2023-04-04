import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { PropertyWithGroup } from './PropertyWithGroup.kysely';
import { PropertyWithPage } from './PropertyWithPage.kysely';
import { PropertyWithUser } from './PropertyWithUser.kysely';
import { TProperty } from './TProperty';

export const createProperty = (propertyPartial: TDatabase['properties'], db: Kysely<TDatabase>): TEntityAsync<TProperty> => {
	const { id, key, type, value } = propertyPartial;
	if (type === 'plain') {
		const property = { id, key, type, value };
		return property;
	} else if (type === 'user') {
		const property = new PropertyWithUser({ id, key, type, value }, db);
		return property;
	} else if (type === 'group') {
		const property = new PropertyWithGroup({ id, key, type, value }, db);
		return property;
	} else {
		const property = new PropertyWithPage({ id, key, type, value }, db);
		return property;
	}
}
