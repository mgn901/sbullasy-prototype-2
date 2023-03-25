import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { ISession } from './ISession';

export class Session implements EntityAsync<ISession> {

	public constructor(session: Database['sessions'], db: Kysely<Database>) {
		this.db = db;
		this.id = session.id;
		this.loggedInAt = session.loggedInAt;
		this.expiresAt = session.expiresAt;
		this.ipAddress = session.ipAddress;
		this.name = session.name;
		this.userID = session.user;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public readonly loggedInAt: number;
	public readonly expiresAt: number;
	public readonly ipAddress: string;
	public readonly name: string;
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
	}

}
