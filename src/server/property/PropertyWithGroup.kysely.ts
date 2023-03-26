import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { IPropertyWithGroup } from './IPropertyWithGroup'

export class PropertyWithGroup implements EntityAsync<IPropertyWithGroup> {

	constructor(property: Database['properties'] & { type: 'group' }, db: Kysely<Database>) {
		this.db = db;
		this.id = property.id;
		this.key = property.key;
		this.type = property.type;
		this.valueID = property.value;
	}

	private db: Kysely<Database>;
	public readonly id: string;
	public readonly key: string;
	public readonly type: 'group';
	private _value?: Promise<EntityAsync<IGroup> | undefined>;
	private valueID?: string;

	public get value(): Promise<EntityAsync<IGroup> | undefined> | undefined {
		if (this._value) {
			return this._value;
		}
		const valueID = this.valueID;
		if (!valueID) {
			return undefined;
		}
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('groups')
				.where('id', '==', valueID)
				.selectAll()
				.execute();
			const groupPartial = groupsPartial[0];
			if (!groupPartial) {
				return undefined;
			}
			const group = new Group(groupPartial, this.db);
			return group;
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
