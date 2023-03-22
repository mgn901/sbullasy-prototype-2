import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IUserTagRequest } from './IUserTagRequest';

export class UserTagRequest implements EntityAsync<IUserTagRequest> {

	constructor(userTagRequest: Database['usertagrequests'], db: Kysely<Database>) {
		this.db = db;
		this.id = userTagRequest.id;
		this.email = userTagRequest.email;
		this.createdAt = userTagRequest.createdAt;
		this.isDisposed = userTagRequest.isDisposed;
		this.token = userTagRequest.token;
		this._user = userTagRequest.user;
		this._tag = userTagRequest.tag;
	}

	private db: Kysely<Database>;
	public id: string;
	public email: string;
	public createdAt: number;
	public isDisposed: boolean;
	public token: string;
	private _user: string;
	private _tag: string;

	public get user(): Promise<EntityAsync<IUser>> {
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
