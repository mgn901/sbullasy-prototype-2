import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { ICategory } from './ICategory';
import { ICategoryRepository } from './ICategoryRepository';

export class CategoryRepository implements ICategoryRepository {

	public async findByID(id: string): Promise<EntityAsync<ICategory> | undefined> {
		const subjects = await this.findByIDs(id);
		const subject = subjects[0];
		return subject;
	}

	public async findByIDs(...ids: string[]): Promise<EntityAsync<ICategory>[]> {
		const category = await db
			.selectFrom('categories')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return category;
	}

	public async save(item: ICategory | EntityAsync<ICategory>): Promise<void> {
		await db
			.insertInto('categories')
			.values(item)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(item))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('subjects_categories')
			.where('category_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('categories')
			.where('id', 'in', id)
			.executeTakeFirst();

		return;
	}

}
