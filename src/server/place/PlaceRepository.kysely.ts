import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { IPlace } from './IPlace';
import { IPlaceRepository } from './IPlaceRepository';

export class PlaceRepository implements IPlaceRepository {

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IPlace>[]> {
		const places = await db
			.selectFrom('places')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return places;
	}

	public async findByID(id: string): Promise<TEntityAsync<IPlace> | undefined> {
		const places = await this.findByIDs(id);
		const place = places[0];
		return place;
	}

	public async findAll(): Promise<TEntityAsync<IPlace>[]> {
		const places = await db
			.selectFrom('places')
			.selectAll()
			.execute();
		return places;
	}

	public async save(place: IPlace | TEntityAsync<IPlace>): Promise<void> {
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
			.deleteFrom('places')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
