import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IProperty } from './IProperty';

export class Property implements EntityAsync<IProperty> {

	public constructor(property: Database['properties'], db: Kysely<Database>) {
		this.db = db;
		this.id = property.id;
		this.key = property.key;
		this.value = property.value;
		this.user_id = property.user;
		this.group_id = property.group;
		this.page_id = property.page;
		this.isUserSet = false;
		this.isGroupSet = false;
		this.isPageSet = false;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public readonly key: string;
	public value: string;
	private user_id: Database['properties']['user'];
	private group_id: Database['properties']['group'];
	private page_id: Database['properties']['page'];
	private _user?: Promise<EntityAsync<IUser>> | undefined;
	private _group?: Promise<EntityAsync<IGroup>> | undefined;
	private _page?: Promise<EntityAsync<IPage>> | undefined;
	private isUserSet: boolean;
	private isGroupSet: boolean;
	private isPageSet: boolean;

	public get user(): Promise<EntityAsync<IUser>> | undefined {
		if (this.isUserSet) {
			return this._user;
		}
		const user_id = this.user_id;
		if (!user_id) {
			return undefined;
		}
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('users')
				.where('id', '==', user_id)
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

	public get group(): Promise<EntityAsync<IGroup>> | undefined {
		if (this.isGroupSet) {
			return this._group;
		}
		const group_id = this.group_id;
		if (!group_id) {
			return undefined;
		}
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('groups')
				.where('id', '==', group_id)
				.selectAll()
				.execute();
			const groupPartial = groupsPartial[0];
			const group = new Group(groupPartial, this.db);
			return group;
		})();
		return promise;
	}

	public get page(): Promise<EntityAsync<IPage>> | undefined {
		if (this.isPageSet) {
			return this._page;
		}
		const page_id = this.page_id;
		if (!page_id) {
			return undefined;
		}
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('pages')
				.where('id', '==', page_id)
				.selectAll()
				.execute();
			const pagePartial = pagesPartial[0];
			const page = new Page(pagePartial, this.db);
			return page;
		})();
		return promise;
	}

	public set user(user) {
		this._user = user;
		this.isUserSet = true;
	}

	public set group(group) {
		this._group = group;
		this.isGroupSet = true;
	}

	public set page(page) {
		this._page = page;
		this.isPageSet = true;
	}

}
