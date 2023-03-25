import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IGroupTag } from './IGroupTag';

export class GroupTag implements EntityAsync<IGroupTag> {

	public constructor(groupTag: Database['grouptags'], db: Kysely<Database>) {
		this.db = db;
		this.id = groupTag.id;
		this.name = groupTag.name;
		this.displayName = groupTag.displayName;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public name: string;
	public displayName: string;
	private _grantableBy?: Promise<EntityAsync<IUserTag>[]>;

	public get grantableBy(): Promise<EntityAsync<IUserTag>[]> {
		if (this._grantableBy) {
			return this._grantableBy;
		}
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('grouptag_grantableby_usertags')
				.where('grouptag_id', '==', this.id)
				.innerJoin('usertags', 'usertags.id', 'grouptag_grantableby_usertags.usertag_id')
				.selectAll()
				.execute();
			const tags = tagsPartial.map((tagPartial) => {
				const tag = new UserTag(tagPartial, this.db);
				return tag;
			});
			return tags;
		})();
		return promise;
	}

	public set grantableBy(grantableBy) {
		this._grantableBy = grantableBy;
	}

}
