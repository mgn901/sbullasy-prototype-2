import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { ISubjectCategory } from './ISubjectCategory';
import { ISubjectCategoryRepository } from './ISubjectCategoryRepository';

export class SubjectCategoryRepository implements ISubjectCategoryRepository {

	public async findByID(id: string): Promise<EntityAsync<ISubjectCategory> | undefined> {
		const categories = await this.findByIDs(id);
		const category = categories[0];
		return category;
	}

	public async findByIDs(...ids: string[]): Promise<EntityAsync<ISubjectCategory>[]> {
		const categories = await db
			.selectFrom('categories')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return categories;
	}

	public async findAll(): Promise<EntityAsync<ISubjectCategory>[]> {
		const categories = await db
			.selectFrom('categories')
			.selectAll()
			.execute();
		return categories;
	}

	public async save(item: ISubjectCategory | EntityAsync<ISubjectCategory>): Promise<void> {
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
			.deleteFrom('categories')
			.where('id', 'in', id)
			.executeTakeFirst();

		return;
	}

}
