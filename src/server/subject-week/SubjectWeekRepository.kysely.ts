import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

export class SubjectWeekRepository implements ISubjectWeekRepository {

	public async findByID(id: string): Promise<EntityAsync<ISubjectWeek> | undefined> {
		const weeks = await this.findByIDs(id);
		const week = weeks[0];
		return week;
	}

	public async findByIDs(...ids: string[]): Promise<EntityAsync<ISubjectWeek>[]> {
		const weeks = await db
			.selectFrom('subjectweeks')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return weeks;
	}

	public async findAll(): Promise<EntityAsync<ISubjectWeek>[]> {
		const weeks = await db
			.selectFrom('subjectweeks')
			.selectAll()
			.execute();
		return weeks;
	}

	public async save(week: ISubjectWeek | EntityAsync<ISubjectWeek>): Promise<void> {
		await db
			.insertInto('subjectweeks')
			.values(week)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(week))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('subjectweeks')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
