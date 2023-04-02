import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IAPIToken, IAPITokenPermission } from './IAPIToken'

export class APIToken implements TEntityAsync<IAPIToken> {

	constructor(apiToken: TDatabase['apitokens'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = apiToken.id;
		this.token = apiToken.token;
		this.createdAt = apiToken.createdAt;
		this.permission = apiToken.permission;
		this.userID = apiToken.user;
	}

	private db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly token: string;
	public readonly createdAt: number;
	public readonly permission: IAPITokenPermission[];
	private readonly userID: string;

	public get user(): Promise<TEntityAsync<IUser>> {
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('users')
				.where('id', '==', this.userID)
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	};

}
