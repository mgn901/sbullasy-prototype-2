import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IResetPasswordRequest } from './IResetPasswordRequest';

export class ResetPasswordRequest implements EntityAsync<IResetPasswordRequest> {

	public constructor(resetPasswordRequest: Database['resetpasswordrequests'], db: Kysely<Database>) {
		this.db = db;
		this.id = resetPasswordRequest.id;
		this.email = resetPasswordRequest.email;
		this.createdAt = resetPasswordRequest.createdAt;
		this.isDisposed = resetPasswordRequest.isDisposed;
		this.userID = resetPasswordRequest.user;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public readonly email: string;
	public readonly createdAt: number;
	public isDisposed: boolean;
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
