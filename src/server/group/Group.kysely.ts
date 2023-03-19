import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { GroupTag } from '../group-tag/GroupTag.kysely';
import { IGroupTag } from '../group-tag/IGroupTag';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { IProperty } from '../property/IProperty';
import { Property } from '../property/Property.kysely';
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

	private db: Kysely<Database>;
	public id: string;
	public name: string;
	public createdAt: number;
	public updatedAt: number;
	public invitationToken: string;

	public get tags(): Promise<EntityAsync<IGroupTag>[]> {
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

	public get properties(): Promise<EntityAsync<IProperty<string, string>>[]> {
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('group_properties')
				.where('group_id', '==', this.id)
				.innerJoin('properties', 'properties.id', 'group_properties.property_id')
				.selectAll()
				.execute();
			const properties = propertiesPartial.map((propertyPartial) => {
				const property = new Property(propertyPartial, this.db);
				return property;
			});
			return properties;
		})();
		return promise;
	}

	public get owner(): Promise<EntityAsync<IUser>> {
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

}
