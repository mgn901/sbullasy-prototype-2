import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { ISession } from './ISession';

export class Session implements EntityAsync<ISession> {

	constructor(session: Database['sessions'], db: Kysely<Database>) {
		this.db = db;
		this.id = session.id;
		this.loggedInAt = session.loggedInAt;
		this.expiresAt = session.expiresAt;
		this.ipAddress = session.ipAddress;
		this.name = session.name;
		this._user = session.user;
	}

	private db: Kysely<Database>;
	public id: string;
	public loggedInAt: number;
	public expiresAt: number;
	public ipAddress: string;
	public name: string;
	private _user: string;

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

}
