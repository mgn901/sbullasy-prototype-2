import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IPropertyWithUser } from './IPropertyWithUser'

export class PropertyWithUser implements EntityAsync<IPropertyWithUser> {

	constructor(property: Database['properties'] & { type: 'user' }, db: Kysely<Database>) {
		this.db = db;
		this.id = property.id;
		this.key = property.key;
		this.type = property.type;
		this.valueID = property.value;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public readonly key: string;
	public readonly type: 'user';
	private _value?: Promise<EntityAsync<IUser> | undefined>;
	private valueID?: string;

	public get value(): Promise<EntityAsync<IUser> | undefined> | undefined {
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
