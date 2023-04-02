import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';
import { UserTagGrantability } from './UserTagGrantability.kysely';

export class UserTag implements TEntityAsync<IUserTag> {

	constructor(userTag: TDatabase['usertags'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = userTag.id;
		this.name = userTag.name;
		this.displayName = userTag.displayName;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public name: string;
	public displayName: string;
	private _grantablyBy?: Promise<TEntityAsync<IUserTagGrantability>[]>;

	public get grantableBy(): Promise<TEntityAsync<IUserTagGrantability>[]> {
		if (this._grantablyBy) {
			return this._grantablyBy;
		}
		const promise = (async () => {
			const grantableByPartial = await this.db
				.selectFrom('usertaggrantabilities')
				.where('tag', '==', this.id)
				.selectAll()
				.execute();
			const grantableBy = grantableByPartial.map((grantableByPartialItem) => {
				const grantableByItem = new UserTagGrantability(grantableByPartialItem, this.db);
				return grantableByItem;
			});
			return grantableBy;
		})();
		return promise;
	}

	public set grantableBy(grantableBy) {
		this._grantablyBy = grantableBy;
	}

}
