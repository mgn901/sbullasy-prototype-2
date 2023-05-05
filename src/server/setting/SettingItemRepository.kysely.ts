import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ISettingItem } from './ISettingItem';
import { ISettingItemRepository } from './ISettingItemRepository';
import { defaultSettings } from './defaultSettings';

export class SettingItemRepository implements ISettingItemRepository {

	public constructor() {}

	public async findByID(id: keyof typeof defaultSettings): Promise<TEntityAsync<ISettingItem>> {
		const items = await this.findByIDs(id);
		const item = items[0];
		if (item === undefined) {
			const defaultItem: ISettingItem = {
				id: id,
				value: defaultSettings[id],
			};
			return defaultItem;
		}
		return item;
	}

	public async findByIDs(...ids: (keyof typeof defaultSettings)[]): Promise<TEntityAsync<ISettingItem>[]> {
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

	public async deleteByID(id: keyof typeof defaultSettings): Promise<void> {
		await db
			.deleteFrom('settings')
			.where('id', '==', id)
			.executeTakeFirst();
	}

}
