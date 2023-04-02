import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { IUndoChangeEmailRequest } from './IUndoChangeEmailRequest';
import { IUndoChangeEmailRequestRepository } from './IUndoChangeEmailRequestRepository';
import { UndoChangeEmailRequest } from './UndoChangeEmailRequest.kysely';

export class UndoChangeEmailRequestRepository implements IUndoChangeEmailRequestRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IUndoChangeEmailRequest>[]> {
		const requestsPartial = await db
			.selectFrom('undochangeemailrequests')
			.where('id', 'in', ids)
			.where('user', 'is not', null)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new UndoChangeEmailRequest(requestPartial, db);
			return request;
		});
		return requests;
	}

	public async findByID(id: string): Promise<TEntityAsync<IUndoChangeEmailRequest> | undefined> {
		const requests = await this.findByIDs(id);
		const request = requests[0];
		return request;
	}

	public async save(request: IUndoChangeEmailRequest | TEntityAsync<IUndoChangeEmailRequest>): Promise<void> {
		const user = await request.user;
		const requestPartial = {
			id: request.id,
			user: user.id,
			email: request.email,
			createdAt: request.createdAt,
		};
		await db
			.insertInto('undochangeemailrequests')
			.values(requestPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(requestPartial))
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('undochangeemailrequests')
			.where('id', '==', id)
			.executeTakeFirst();
		return;
	}

}
