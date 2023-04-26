import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { IUserTagRequest } from './IUserTagRequest';
import { IUserTagRequestRepository } from './IUserTagRequestRepository';
import { UserTagRequest } from './UserTagRequest.kysely';

export class UserTagRequestRepository implements IUserTagRequestRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IUserTagRequest>[]> {
		const requestsPartial = await db
			.selectFrom('usertagrequests')
			.where('id', 'in', ids)
			.where('user', 'is not', null)
			.where('tag', 'is not', null)
			.where('grantability', 'is not', null)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new UserTagRequest(requestPartial, db);
			return request;
		});
		return requests;
	}

	public async findByID(id: string): Promise<TEntityAsync<IUserTagRequest> | undefined> {
		const requests = await this.findByIDs(id);
		const request = requests[0];
		return request;
	}

	public async findByToken(token: string): Promise<TEntityAsync<IUserTagRequest> | undefined> {
		const requestsPartial = await db
			.selectFrom('usertagrequests')
			.where('token', '==', token)
			.where('user', 'is not', null)
			.where('tag', 'is not', null)
			.where('grantability', 'is not', null)
			.selectAll()
			.execute();
		const requestPartial = requestsPartial[0];
		const request = new UserTagRequest(requestPartial, db);
		return request;
	}

	public async findByUserAndTag(user: string, tag: string): Promise<TEntityAsync<IUserTagRequest>[]> {
		const requestsPartial = await db
			.selectFrom('usertagrequests')
			.where('user', '==', user)
			.where('tag', '==', tag)
			.where('grantability', 'is not', null)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new UserTagRequest(requestPartial, db);
			return request;
		});
		return requests;
	}

	public async save(request: IUserTagRequest | TEntityAsync<IUserTagRequest>): Promise<void> {
		const user = await request.user;
		const tag = await request.tag;
		const grantability = await request.grantability;
		const requestPartial = {
			id: request.id,
			user: user.id,
			tag: tag.id,
			grantability: grantability.id,
			email: request.email,
			createdAt: request.createdAt,
			isDisposed: request.isDisposed,
			token: request.token,
		};
		await db
			.insertInto('usertagrequests')
			.values(requestPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(requestPartial))
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('usertagrequests')
			.where('id', '==', id)
			.executeTakeFirst();
		return;
	}

	public async deleteByUserAndTag(user: string, tag: string): Promise<void> {
		await db
			.deleteFrom('usertagrequests')
			.where('user', '==', user)
			.where('tag', '==', tag)
			.executeTakeFirst();
		return;
	}

}
