import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IPlace } from './IPlace';
import { IPlaceRepository } from './IPlaceRepository';

export class PlaceRepository implements IPlaceRepository {

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IPlace>[]> {
		const places = await db
			.selectFrom('places')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return places;
	}

	public async save(place: IPlace | EntityAsync<IPlace>): Promise<void> {
		await db
			.insertInto('places')
			.values(place)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(place))
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('pages_places')
			.where('place_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('places')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
