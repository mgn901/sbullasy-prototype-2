import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IUserTagRequest } from './IUserTagRequest';
import { IUserTagRequestRepository } from './IUserTagRequestRepository';
import { UserTagRequest } from './UserTagRequest.kysely';

export class UserTagRequestRepository implements IUserTagRequestRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IUserTagRequest>[]> {
		const requestsPartial = await db
			.selectFrom('usertagrequests')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new UserTagRequest(requestPartial, db);
			return request;
		});
		return requests;
	}

	public async save(request: IUserTagRequest | EntityAsync<IUserTagRequest>): Promise<void> {
		const user = await request.user;
		const tag = await request.tag;
		const requestPartial = {
			id: request.id,
			user: user.id,
			tag: tag.id,
			email: request.email,
			createdAt: request.createdAt,
			isDisposed: request.isDisposed,
			token: request.token,
		};
		await db
			.insertInto('usertagrequests')
			.values(requestPartial)
			.onConflict(oc => {
				return oc
					.column('id')
					.doUpdateSet(requestPartial)
			})
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('usertagrequests')
			.where('id', 'in', id)
			.executeTakeFirst();
		return;
	}

}
