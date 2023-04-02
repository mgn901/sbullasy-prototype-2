import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

export class SubjectWeekRepository implements ISubjectWeekRepository {

	public async findByID(id: string): Promise<TEntityAsync<ISubjectWeek> | undefined> {
		const weeks = await this.findByIDs(id);
		const week = weeks[0];
		return week;
	}

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<ISubjectWeek>[]> {
		const weeks = await db
			.selectFrom('subjectweeks')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return weeks;
	}

	public async findAll(): Promise<TEntityAsync<ISubjectWeek>[]> {
		const weeks = await db
			.selectFrom('subjectweeks')
			.selectAll()
			.execute();
		return weeks;
	}

	public async save(week: ISubjectWeek | TEntityAsync<ISubjectWeek>): Promise<void> {
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
