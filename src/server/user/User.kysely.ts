import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { IProperty } from '../property/IProperty';
import { Property } from '../property/Property.kysely';
import { ISession } from '../session/ISession';
import { Session } from '../session/Session.kysely';
import { IUserTag } from '../user-tag/IUserTag';
import { UserTag } from '../user-tag/UserTag.kysely';
import { IUser } from './IUser';

export class User implements EntityAsync<IUser> {

	public constructor(user: Database['users'], db: Kysely<Database>) {
		this.db = db;
		this.id = user.id;
		this.email = user.email;
		this.password = user.password;
		this.displayName = user.displayName;
	}

	private db: Kysely<Database>;
	public id: string;
	public email: string;
	public password: string;
	public displayName: string;

	public get tags(): Promise<EntityAsync<IUserTag>[]> {
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('users_tags')
				.where('user_id', '==', this.id)
				.innerJoin('usertags', 'usertags.id', 'users_tags.tag_id')
				.selectAll()
				.execute();
			const tags = tagsPartial.map((tagPartial) => {
				const tag = new UserTag(tagPartial, this.db);
				return tag;
			})
			return tags;
		})();
		return promise;
	}

	public get properties(): Promise<EntityAsync<IProperty<string, string>>[]> {
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('user_properties')
				.where('user_id', '==', this.id)
				.innerJoin('properties', 'properties.id', 'user_properties.property_id')
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

	public get sessions(): Promise<EntityAsync<ISession>[]> {
		const promise = (async () => {
			const sessionsPartial = await this.db
				.selectFrom('sessions')
				.where('user', '==', this.id)
				.selectAll()
				.execute();
			const sessions = sessionsPartial.map((sessionPartial) => {
				const session = new Session(sessionPartial, this.db);
				return session;
			});
			return sessions;
		})();
		return promise;
	}

	public get owns(): Promise<EntityAsync<IGroup>[]> {
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('user_owns_groups')
				.where('user_id', '==', this.id)
				.innerJoin('groups', 'groups.id', 'user_owns_groups.group_id')
				.selectAll()
				.execute();
			const groups = groupsPartial.map((groupPartial) => {
				const group = new Group(groupPartial, this.db);
				return group;
			});
			return groups;
		})();
		return promise;
	}

	public get belongs(): Promise<EntityAsync<IGroup>[]> {
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('users_belongs_groups')
				.where('user_id', '==', this.id)
				.innerJoin('groups', 'groups.id', 'users_belongs_groups.group_id')
				.selectAll()
				.execute();
			const groups = groupsPartial.map((groupPartial) => {
				const group = new Group(groupPartial, this.db);
				return group;
			});
			return groups;
		})();
		return promise;
	}

	public get watchesGroups(): Promise<EntityAsync<IGroup>[]> {
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('users_watches_groups')
				.where('user_id', '==', this.id)
				.innerJoin('groups', 'groups.id', 'users_watches_groups.group_id')
				.selectAll()
				.execute();
			const groups = groupsPartial.map((groupPartial) => {
				const group = new Group(groupPartial, this.db);
				return group;
			});
			return groups;
		})();
		return promise;
	}

	public get watchesPages(): Promise<EntityAsync<IPage>[]> {
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('users_watches_pages')
				.where('user_id', '==', this.id)
				.innerJoin('pages', 'pages.id', 'users_watches_pages.page_id')
				.selectAll()
				.execute();
			const pages = pagesPartial.map((pagePartial) => {
				const page = new Page(pagePartial, this.db);
				return page;
			});
			return pages;
		})();
		return promise;
	}

	public get pages(): Promise<EntityAsync<IPage>[]> {
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('user_pages')
				.where('user_id', '==', this.id)
				.innerJoin('pages', 'pages.id', 'user_pages.page_id')
				.selectAll()
				.execute();
			const pages = pagesPartial.map((pagePartial) => {
				const page = new Page(pagePartial, this.db);
				return page;
			});
			return pages;
		})();
		return promise;
	}

}
