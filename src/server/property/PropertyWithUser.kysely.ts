import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IPropertyWithUser } from './IPropertyWithUser'

export class PropertyWithUser implements TEntityAsync<IPropertyWithUser> {

	constructor(property: TDatabase['properties'] & { type: 'user' }, db: Kysely<TDatabase>) {
		this.db = db;
		this.id = property.id;
		this.key = property.key;
		this.type = property.type;
		this.valueID = property.value;
	}

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly key: string;
	public readonly type: 'user';
	private _value?: Promise<TEntityAsync<IUser> | undefined>;
	private valueID?: string;

	public get value(): Promise<TEntityAsync<IUser> | undefined> | undefined {
		if (this._value) {
			return this._value;
		}
		const valueID = this.valueID;
		if (!valueID) {
			return undefined;
		}
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('users')
				.where('id', '==', valueID)
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			if (!userPartial) {
				return undefined;
			}
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

	public set value(value) {
		this._value = value;
		(async () => {
			const valueAwaited = await value;
			this.valueID = valueAwaited?.id;
		})();
	}

}
