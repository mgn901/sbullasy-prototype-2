import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { PropertyWithGroup } from '../property/PropertyWithGroup.kysely';
import { PropertyWithPage } from '../property/PropertyWithPage.kysely';
import { PropertyWithUser } from '../property/PropertyWithUser.kysely';
import { TProperty } from '../property/TProperty';

export const createProperty = (propertyPartial: Database['properties'], db: Kysely<Database>): EntityAsync<TProperty> => {
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
