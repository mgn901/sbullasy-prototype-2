import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IResetPasswordRequest } from './IResetPasswordRequest';

export class ResetPasswordRequest implements EntityAsync<IResetPasswordRequest> {

	constructor(resetPasswordRequest: Database['resetpasswordrequests'], db: Kysely<Database>) {
		this.db = db;
		this.id = resetPasswordRequest.id;
		this.email = resetPasswordRequest.email;
		this.createdAt = resetPasswordRequest.createdAt;
		this.isDisposed = resetPasswordRequest.isDisposed;
		this._user = resetPasswordRequest.user;
	}

	private db: Kysely<Database>;
	public id: string;
	public email: string;
	public createdAt: number;
	public isDisposed: boolean;
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
