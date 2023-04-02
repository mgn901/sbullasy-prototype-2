import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ITeacher } from './ITeacher';
import { ITeacherRepository } from './ITeacherRepository';

export class TeacherRepository implements ITeacherRepository {

	public async findByID(id: string): Promise<TEntityAsync<ITeacher> | undefined> {
		const teachers = await this.findByIDs(id);
		const teacher = teachers[0];
		return teacher;
	}

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<ITeacher>[]> {
		const teachers = await db
			.selectFrom('teachers')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return teachers;
	}

	public async findAll(): Promise<TEntityAsync<ITeacher>[]> {
		const teachers = await db
			.selectFrom('teachers')
			.selectAll()
			.execute();
		return teachers;
	}

	public async save(item: ITeacher | TEntityAsync<ITeacher>): Promise<void> {
		await db
			.insertInto('teachers')
			.values(item)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(item))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('teachers')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
