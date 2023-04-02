import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { IPropertyWithPage } from './IPropertyWithPage'

export class PropertyWithPage implements TEntityAsync<IPropertyWithPage> {

	constructor(proeprty: TDatabase['properties'] & { type: 'page' }, db: Kysely<TDatabase>) {
		this.db = db;
		this.id = proeprty.id;
		this.key = proeprty.key;
		this.type = proeprty.type;
		this.valueID = proeprty.value;
	}

	private db: Kysely<TDatabase>;
	public readonly id: string;
	public readonly key: string;
	public readonly type: 'page';
	private _value?: Promise<TEntityAsync<IPage> | undefined> | undefined;
	private valueID?: string;

	public get value(): Promise<TEntityAsync<IPage> | undefined> | undefined {
		if (this._value) {
			return this._value;
		}
		const valueID = this.valueID;
		if (!valueID) {
			return undefined;
		}
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('pages')
				.where('id', '==', valueID)
				.selectAll()
				.execute();
			const pagePartial = pagesPartial[0];
			if (!pagePartial) {
				return undefined;
			}
			const page = new Page(pagePartial, this.db);
			return page;
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
