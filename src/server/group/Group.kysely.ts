import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { GroupTag } from '../group-tag/GroupTag.kysely';
import { IGroupTag } from '../group-tag/IGroupTag';
import { createProperty } from '../kysely/createProperty.kysely';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { TProperty } from '../property/TProperty';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IGroup } from './IGroup';

export class Group implements EntityAsync<IGroup> {

	public constructor(group: Database['groups'], db: Kysely<Database>) {
		this.db = db;
		this.id = group.id;
		this.name = group.name;
		this.createdAt = group.createdAt;
		this.updatedAt = group.updatedAt;
		this.invitationToken = group.invitationToken;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public name: string;
	public readonly createdAt: number;
	public updatedAt: number;
	public invitationToken: string;
	private _tags?: Promise<EntityAsync<IGroupTag>[]>;
	private _properties?: Promise<EntityAsync<TProperty>[]>;
	private _owner?: Promise<EntityAsync<IUser>>;
	private _members?: Promise<EntityAsync<IUser>[]>;
	private _pages?: Promise<EntityAsync<IPage>[]>;

	public get tags(): Promise<EntityAsync<IGroupTag>[]> {
		if (this._tags) {
			return this._tags;
		}
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('groups_tags')
				.where('group_id', '==', this.id)
				.innerJoin('grouptags', 'grouptags.id', 'groups_tags.tag_id')
				.selectAll()
				.execute();
			const tags = tagsPartial.map((tagPartial) => {
				const tag = new GroupTag(tagPartial, this.db);
				return tag;
			})
			return tags;
		})();
		return promise;
	}

	public get properties(): Promise<EntityAsync<TProperty>[]> {
		if (this._properties) {
			return this._properties;
		}
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('group_properties')
				.where('group_id', '==', this.id)
				.innerJoin('properties', 'properties.id', 'group_properties.property_id')
				.selectAll()
				.execute();
			const properties = propertiesPartial.map((propertyPartial) => {
				const property = createProperty(propertyPartial, this.db);
				return property;
			});
			return properties;
		})();
		return promise;
	}

	public get owner(): Promise<EntityAsync<IUser>> {
		if (this._owner) {
			return this._owner;
		}
		const promise = (async () => {
			const usersPartial = await
				this.db.selectFrom('user_owns_groups')
					.where('group_id', '==', this.id)
					.innerJoin('users', 'users.id', 'user_owns_groups.user_id')
					.selectAll()
					.execute();
			const userPartial = usersPartial[0];
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

	public get members(): Promise<EntityAsync<IUser>[]> {
		if (this._members) {
			return this._members;
		}
		const promise = (async () => {
			const usersPartial = await
				this.db.selectFrom('users_belongs_groups')
					.where('group_id', '==', this.id)
					.innerJoin('users', 'users.id', 'users_belongs_groups.user_id')
					.selectAll()
					.execute();
			const users = usersPartial.map((userPartial) => {
				const user = new User(userPartial, this.db)
				return user;
			});
			return users;
		})();
		return promise;
	}

	public get pages(): Promise<EntityAsync<IPage>[]> {
		if (this._pages) {
			return this._pages;
		}
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('group_pages')
				.where('group_id', '==', this.id)
				.innerJoin('pages', 'pages.id', 'group_pages.page_id')
				.selectAll()
				.execute();
			const pages = pagesPartial.map((pagePartial) => {
				const page = new Page(pagePartial, this.db);
				return page
			});
			return pages;
		})();
		return promise;
	}

	public set tags(tags) {
		this._tags = tags;
	}

	public set properties(properties) {
		this._properties = properties;
	}

	public set owner(owner) {
		this._owner = owner;
	}

	public set members(members) {
		this._members = members;
	}

	public set pages(pages) {
		this._pages = pages;
	}

}
