import { TEntityAsync } from '../TEntityAsync';
import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { db } from '../database/db.kysely';
import { APIToken } from './APIToken.kysely';
import { IAPIToken } from './IAPIToken';
import { IAPITokenRepository } from './IAPITokenRepository';

export class APITokenRepostitory implements IAPITokenRepository {

	public constructor() { }

	public async findByID(id: string): Promise<TEntityAsync<IAPIToken> | undefined> {
		const tokens = await this.findByIDs(id);
		const token = tokens[0];
		return token;
	}

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IAPIToken>[]> {
		const tokensPartial = await db
			.selectFrom('apitokens')
			.where('id', 'in', ids)
			.where('user', 'is not', null)
			.selectAll()
			.execute();
		const tokens = tokensPartial.map((tokenPartial) => {
			const token = new APIToken(tokenPartial, db);
			return token;
		});
		return tokens;
	}

	public async save(token: IAPIToken | TEntityAsync<IAPIToken>): Promise<void> {
		const user = await token.user;
		const tokenPartial: EntityWithoutEntityKey<IAPIToken> = {
			id: token.id,
			token: token.token,
			createdAt: token.createdAt,
			permission: token.permission,
			user: user.id,
		};
		await db
			.insertInto('apitokens')
			.values(tokenPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(tokenPartial))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('apitokens')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
