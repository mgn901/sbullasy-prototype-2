import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ISubjectCategory } from './ISubjectCategory';
import { ISubjectCategoryRepository } from './ISubjectCategoryRepository';

export class SubjectCategoryRepository implements ISubjectCategoryRepository {

	public async findByID(id: string): Promise<TEntityAsync<ISubjectCategory> | undefined> {
		const categories = await this.findByIDs(id);
		const category = categories[0];
		return category;
	}

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<ISubjectCategory>[]> {
		const categories = await db
			.selectFrom('categories')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return categories;
	}

	public async findAll(): Promise<TEntityAsync<ISubjectCategory>[]> {
		const categories = await db
			.selectFrom('categories')
			.selectAll()
			.execute();
		return categories;
	}

	public async save(item: ISubjectCategory | TEntityAsync<ISubjectCategory>): Promise<void> {
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
