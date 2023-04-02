import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { ISession } from './ISession';

export class Session implements TEntityAsync<ISession> {

	public constructor(session: TDatabase['sessions'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = session.id;
		this.loggedInAt = session.loggedInAt;
		this.expiresAt = session.expiresAt;
		this.ipAddress = session.ipAddress;
		this.name = session.name;
		this.userID = session.user;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly loggedInAt: number;
	public readonly expiresAt: number;
	public readonly ipAddress: string;
	public readonly name: string;
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
	}

}
