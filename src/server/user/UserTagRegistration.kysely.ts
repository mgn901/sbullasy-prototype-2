import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IUserTagRegistration } from './IUserTagRegistration';

export class UserTagRegistration implements EntityAsync<IUserTagRegistration> {

	constructor(userTagRegistration: Database['usertagregistrations'], db: Kysely<Database>) {
		this.db = db;
		this.id = userTagRegistration.id;
		this.expiresAt = userTagRegistration.expiresAt;
		this._tag = userTagRegistration.tag;
	}

	private db: Kysely<Database>;
	public id: string;
	public expiresAt?: number;
	private _tag: string;

	public get tag(): Promise<EntityAsync<IUserTag>> {
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

}
