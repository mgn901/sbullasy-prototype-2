import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IUndoChangeEmailRequest } from './IUndoChangeEmailRequest';

export class UndoChangeEmailRequest implements TEntityAsync<IUndoChangeEmailRequest> {

	constructor(undoChangeEmailRequest: TDatabase['undochangeemailrequests'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = undoChangeEmailRequest.id;
		this.email = undoChangeEmailRequest.email;
		this.createdAt = undoChangeEmailRequest.createdAt;
		this.userID = undoChangeEmailRequest.user;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly email: string;
	public readonly createdAt: number;
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
