import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';
import { UserTagGrantability } from './UserTagGrantability.kysely';

export class UserTag implements EntityAsync<IUserTag> {

	constructor(userTag: Database['usertags'], db: Kysely<Database>) {
		this.db = db;
		this.id = userTag.id;
		this.name = userTag.name;
		this.displayName = userTag.displayName;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public name: string;
	public displayName: string;
	private _grantablyBy?: Promise<EntityAsync<IUserTagGrantability>[]>;

	public get grantableBy(): Promise<EntityAsync<IUserTagGrantability>[]> {
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
