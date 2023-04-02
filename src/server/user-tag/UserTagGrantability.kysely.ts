import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';
import { UserTag } from './UserTag.kysely';

export class UserTagGrantability implements TEntityAsync<IUserTagGrantability> {

	constructor(userTagGrantability: TDatabase['usertaggrantabilities'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = userTagGrantability.id;
		this.grantableByEmailRegex = userTagGrantability.id;
		this.expires = userTagGrantability.expires;
		this._tag = userTagGrantability.tag;
		this._grantableByUserTag = userTagGrantability.grantableByUserTag;
	}
	
	private db: Kysely<TDatabase>;
	public id: string;
	public grantableByEmailRegex?: string | undefined;
	public expires?: number | undefined;
	private _tag: string;
	private _grantableByUserTag?: string | undefined;

	public get tag(): Promise<TEntityAsync<IUserTag>> {
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('usertags')
				.where('id', '==', this._tag)
				.selectAll()
				.execute();
			const tagPartial = tagsPartial[0];
			const tag = new UserTag(tagPartial, this.db);
			return tag;
		})();
		return promise;
	}

	public get grantableByUserTag(): Promise<TEntityAsync<IUserTag>> | undefined {
		const usertag_id = this._grantableByUserTag;
		if (!usertag_id) {
			return undefined;
		}
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('usertags')
				.where('id', '==', usertag_id)
				.selectAll()
				.execute();
			const tagPartial = tagsPartial[0];
			const tag = new UserTag(tagPartial, this.db);
			return tag;
		})();
		return promise;

	}

}
