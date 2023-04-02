import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { ILoginFailure } from './ILoginFailure';
import { ILoginFailureRepository } from './ILoginFailureRepository';

export class LoginFailureRepository implements ILoginFailureRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<ILoginFailure>[]> {
		const loginFailures = await db
			.selectFrom('loginfailures')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		return loginFailures;
	}

	public async findByID(id: string): Promise<TEntityAsync<ILoginFailure> | undefined> {
		const loginFailures = await this.findByIDs(id);
		const loginFailure = loginFailures[0];
		return loginFailure;
	}

	public async save(loginFailure: ILoginFailure | TEntityAsync<ILoginFailure>): Promise<void> {
		await db
			.insertInto('loginfailures')
			.values(loginFailure)
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('loginfailures')
			.where('id', '==', id)
			.executeTakeFirst();
		return;
	}

}
