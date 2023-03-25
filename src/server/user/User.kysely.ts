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
import { IUser } from './IUser';
import { IUserTagRegistration } from './IUserTagRegistration';
import { UserTagRegistration } from './UserTagRegistration.kysely';

export class User implements EntityAsync<IUser> {

	public constructor(user: Database['users'], db: Kysely<Database>) {
		this.db = db;
		this.id = user.id;
		this.email = user.email;
		this.password = user.password;
		this.displayName = user.displayName;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public email: string;
	public password: string;
	public displayName: string;
	private _tagRegistrations?: Promise<EntityAsync<IUserTagRegistration>[]>;
	private _properties?: Promise<EntityAsync<IProperty>[]>;
	private _sessions?: Promise<EntityAsync<ISession>[]>;
	private _owns?: Promise<EntityAsync<IGroup>[]>;
	private _belongs?: Promise<EntityAsync<IGroup>[]>;
	private _watchesGroups?: Promise<EntityAsync<IGroup>[]>;
	private _watchesPages?: Promise<EntityAsync<IPage>[]>;
	private _pages?: Promise<EntityAsync<IPage>[]>;

	public get tagRegistrations(): Promise<EntityAsync<IUserTagRegistration>[]> {
		if (this._tagRegistrations) {
			return this._tagRegistrations;
		}
		const promise = (async () => {
			const registrationsPartial = await this.db
				.selectFrom('user_usertagregistrations')
				.where('user_id', '==', this.id)
				.innerJoin('usertagregistrations', 'usertagregistrations.id', 'usertagregistrations.id')
				.selectAll()
				.execute();
			const registrations = registrationsPartial.map((registrationPartial) => {
				const registration = new UserTagRegistration(registrationPartial, this.db);
				return registration;
			})
			return registrations;
		})();
		return promise;
	}

	public get properties(): Promise<EntityAsync<IProperty<string, string>>[]> {
		if (this._properties) {
			return this._properties;
		}
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
		if (this._sessions) {
			return this._sessions;
		}
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
		if (this._owns) {
			return this._owns;
		}
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
		if (this._belongs) {
			return this._belongs;
		}
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
		if (this._watchesGroups) {
			return this._watchesGroups;
		}
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
		if (this._watchesPages) {
			return this._watchesPages;
		}
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
		if (this._pages) {
			return this._pages;
		}
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

	public set tagRegistrations(tagRegistrations) {
		this._tagRegistrations = tagRegistrations;
	}

	public set properties(properties) {
		this._properties = properties;
	}

	public set sessions(sessions) {
		this._sessions = sessions;
	}

	public set owns(owns) {
		this._owns = owns;
	}

	public set belongs(belongs) {
		this._belongs = belongs;
	}

	public set watchesGroups(watchesGroups) {
		this._watchesGroups = watchesGroups;
	}

	public set watchesPages(watchesPages) {
		this._watchesPages = watchesPages;
	}

	public set pages(pages) {
		this._pages = pages;
	}

}
