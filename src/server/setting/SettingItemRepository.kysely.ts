import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ISettingItem } from './ISettingItem';
import { ISettingItemRepository } from './ISettingItemRepository';

export class SettingItemRepository implements ISettingItemRepository {

	public constructor() {}

	public async findByID(id: string): Promise<TEntityAsync<ISettingItem> | undefined> {
		const items = await this.findByIDs(id);
		const item = items[0];
		return item;
	}

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<ISettingItem>[]> {
		const items = await db
			.selectFrom('settings')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return items;
	}

	public async save(item: ISettingItem | TEntityAsync<ISettingItem>): Promise<void> {
		await db
			.insertInto('settings')
			.values(item)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(item))
			.executeTakeFirst();
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('settings')
			.where('id', '==', id)
			.executeTakeFirst();
	}

}
