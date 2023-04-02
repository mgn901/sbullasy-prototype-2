import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { IResetPasswordRequest } from './IResetPasswordRequest';
import { IResetPasswordRequestRepository } from './IResetPasswordRequestRepository';
import { ResetPasswordRequest } from './ResetPasswordRequest.kysely';

export class ResetPasswordRequestRepository implements IResetPasswordRequestRepository {

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IResetPasswordRequest>[]> {
		const requestsPartial = await db
			.selectFrom('resetpasswordrequests')
			.where('id', 'in', ids)
			.where('user', 'is not', null)
			.selectAll()
			.execute();
		const requests = requestsPartial.map((requestPartial) => {
			const request = new ResetPasswordRequest(requestPartial, db);
			return request;
		});
		return requests;
	}

	public async findByID(id: string): Promise<TEntityAsync<IResetPasswordRequest> | undefined> {
		const requests = await this.findByIDs(id);
		const request = requests[0];
		return request;
	}

	public async save(request: IResetPasswordRequest | TEntityAsync<IResetPasswordRequest>): Promise<void> {
		const user = await request.user;
		const requestPartial = {
			id: request.id,
			email: request.email,
			createdAt: request.createdAt,
			isDisposed: request.isDisposed,
			user: user.id,
		};
		await db
			.insertInto('resetpasswordrequests')
			.values(requestPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(requestPartial))
			.executeTakeFirst();
		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('resetpasswordrequests')
			.where('id', '==', id)
			.executeTakeFirst();
		return;
	}

}
