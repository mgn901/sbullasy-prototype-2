import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IUserTagRegistration } from './IUserTagRegistration';
import { IUser } from './IUser';
import { User } from './User.kysely';

export class UserTagRegistration implements TEntityAsync<IUserTagRegistration> {

	constructor(userTagRegistration: TDatabase['usertagregistrations'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = userTagRegistration.id;
		this.expiresAt = userTagRegistration.expiresAt;
		this._user = userTagRegistration.user;
		this._tag = userTagRegistration.tag;
	}

	private db: Kysely<TDatabase>;
	public id: string;
	public expiresAt?: number;
	private _user: string;
	private _tag: string;

	public get user(): Promise<TEntityAsync<IUser>> {
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('users')
				.where('id', '==', this._user)
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

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

}
