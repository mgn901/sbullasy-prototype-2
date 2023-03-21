import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IUndoChangeEmailRequest } from './IUndoChangeEmailRequest';
import { IUndoChangeEmailRequestRepository } from './IUndoChangeEmailRequestRepository';
import { UndoChangeEmailRequest } from './UndoChangeEmailRequest.kysely';

export class UndoChangeEmailRequestRepository implements IUndoChangeEmailRequestRepository {
	
	public constructor() {}
	
	public async findByIDs(...ids: string[]): Promise<EntityAsync<IUndoChangeEmailRequest>[]> {
		const requestsPartial = await db
			.selectFrom('undochangeemailrequests')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new UndoChangeEmailRequest(requestPartial, db);
			return request;
		});
		return requests;
	}
	
	public async save(request: IUndoChangeEmailRequest | EntityAsync<IUndoChangeEmailRequest>): Promise<void> {
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
			.deleteFrom('undochangeemailrequests')
			.where('id', 'in', id)
			.executeTakeFirst();
		return;
	}

}
