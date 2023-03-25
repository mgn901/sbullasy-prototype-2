import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IAPIToken, IAPITokenPermission } from './IAPIToken'

export class APIToken implements EntityAsync<IAPIToken> {

	constructor(apiToken: Database['apitokens'], db: Kysely<Database>) {
		this.db = db;
		this.id = apiToken.id;
		this.token = apiToken.token;
		this.createdAt = apiToken.createdAt;
		this.permission = apiToken.permission;
		this.userID = apiToken.user;
	}

	private db: Kysely<Database>;
	public readonly id: string;
	public readonly token: string;
	public readonly createdAt: number;
	public readonly permission: IAPITokenPermission[];
	private readonly userID: string;

	public get user(): Promise<EntityAsync<IUser>> {
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
