import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { ICreateSessionRequest } from './ICreateSessionRequest'
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';

export class CreateSessionRequest implements TEntityAsync<ICreateSessionRequest> {

	constructor(sessionRequest: TDatabase['createsessionrequests'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = sessionRequest.id;
		this.createdAt = sessionRequest.createdAt;
		this.token = sessionRequest.token;
		this.isDisposed = sessionRequest.isDisposed;
		this._user = sessionRequest.user;
	}

	public readonly id: string;
	public readonly createdAt: number;
	public readonly token: string;
	public isDisposed: boolean;
	private readonly _user: IUser['id'];
	private db: Kysely<TDatabase>;

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

}
