import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IPageTag } from './IPageTag';

export class PageTag implements TEntityAsync<IPageTag> {

	public constructor(pageTag: TDatabase['pagetags'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = pageTag.id;
		this.name = pageTag.name;
		this.displayName = pageTag.displayName;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public name: string;
	public displayName: string;
	private _grantableBy?: Promise<TEntityAsync<IUserTag>[]>;

	public get grantableBy(): Promise<TEntityAsync<IUserTag>[]> {
		if (this._grantableBy) {
			return this._grantableBy;
		}
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('pagetag_grantableby_usertags')
				.where('pagetag_id', '==', this.id)
				.where('usertag_id', 'is not', null)
				.innerJoin('usertags', 'usertags.id', 'pagetag_grantableby_usertags.usertag_id')
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
