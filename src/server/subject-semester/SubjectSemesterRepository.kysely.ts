import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { ISubjectSemester } from './ISubjectSemester';
import { ISubjectSemesterRepository } from './ISubjectSemesterRepository';

export class SubjectSemesterRepository implements ISubjectSemesterRepository {

	public async findByID(id: string): Promise<EntityAsync<ISubjectSemester> | undefined> {
		const semesters = await this.findByIDs(id);
		const semester = semesters[0];
		return semester;
	}

	public async findByIDs(...ids: string[]): Promise<EntityAsync<ISubjectSemester>[]> {
		const semesters = await db
			.selectFrom('subjectsemesters')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return semesters;
	}

	public async findAll(): Promise<EntityAsync<ISubjectSemester>[]> {
		const semesters = await db
			.selectFrom('subjectsemesters')
			.selectAll()
			.execute();
		return semesters;
	}

	public async save(semester: ISubjectSemester | EntityAsync<ISubjectSemester>): Promise<void> {
		await db
			.insertInto('subjectsemesters')
			.values(semester)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(semester))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('subjectsemesters')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
