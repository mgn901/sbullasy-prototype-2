import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUserTag } from '../user-tag/IUserTag';
import { IUserTagGrantability } from '../user-tag/IUserTagGrantability';
import { UserTag } from '../user-tag/UserTag.kysely';
import { UserTagGrantability } from '../user-tag/UserTagGrantability.kysely';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IUserTagRequest } from './IUserTagRequest';

export class UserTagRequest implements TEntityAsync<IUserTagRequest> {

	constructor(userTagRequest: TDatabase['usertagrequests'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = userTagRequest.id;
		this.email = userTagRequest.email;
		this.createdAt = userTagRequest.createdAt;
		this.isDisposed = userTagRequest.isDisposed;
		this.token = userTagRequest.token;
		this._user = userTagRequest.user;
		this._tag = userTagRequest.tag;
		this._grantability = userTagRequest.grantability;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly email: string;
	public readonly createdAt: number;
	public isDisposed: boolean;
	public readonly token: string;
	private readonly _user: string;
	private readonly _tag: string;
	private readonly _grantability: string;

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

	public get grantability(): Promise<TEntityAsync<IUserTagGrantability>> {
		const promise = (async () => {
			const grantabilitiesPartial = await this.db
				.selectFrom('usertaggrantabilities')
				.where('id', '==', this._grantability)
				.selectAll()
				.execute();
			const grantabilityPartial = grantabilitiesPartial[0];
			const grantability = new UserTagGrantability(grantabilityPartial, this.db);
			return grantability;
		})();
		return promise;
	}

}
