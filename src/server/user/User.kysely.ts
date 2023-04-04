import { Kysely } from 'kysely';
import { APIToken } from '../api-token/APIToken.kysely';
import { IAPIToken } from '../api-token/IAPIToken';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { createProperty } from '../property/createProperty.kysely';
import { IPage } from '../page/IPage';
import { Page } from '../page/Page.kysely';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { Session } from '../session/Session.kysely';
import { IUser } from './IUser';
import { IUserTagRegistration } from './IUserTagRegistration';
import { UserTagRegistration } from './UserTagRegistration.kysely';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';
import { CreateSessionRequest } from '../create-session-request/CreateSessionRequest.kysely';

export class User implements TEntityAsync<IUser> {

	public constructor(user: TDatabase['users'], db: Kysely<TDatabase>) {
		this.db = db;
		this.id = user.id;
		this.email = user.email;
		this.displayName = user.displayName;
		this.createdAt = user.createdAt;
		this.ipAddress = user.ipAddress;
	}
	
	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public email: string;
	public displayName: string;
	public readonly createdAt: number;
	public readonly ipAddress: string;
	private _tagRegistrations?: Promise<TEntityAsync<IUserTagRegistration>[]>;
	private _properties?: Promise<TEntityAsync<TProperty>[]>;
	private _sessions?: Promise<TEntityAsync<ISession>[]>;
	private _sessionRequests?: Promise<TEntityAsync<ICreateSessionRequest>[]>;
	private _owns?: Promise<TEntityAsync<IGroup>[]>;
	private _belongs?: Promise<TEntityAsync<IGroup>[]>;
	private _watchesGroups?: Promise<TEntityAsync<IGroup>[]>;
	private _watchesPages?: Promise<TEntityAsync<IPage>[]>;
	private _pages?: Promise<TEntityAsync<IPage>[]>;
	private _apiTokens?: Promise<TEntityAsync<IAPIToken>[]>;

	public get tagRegistrations(): Promise<TEntityAsync<IUserTagRegistration>[]> {
		if (this._tagRegistrations) {
			return this._tagRegistrations;
		}
		const promise = (async () => {
			const registrationsPartial = await this.db
				.selectFrom('usertagregistrations')
				.where('user', '==', this.id)
				.where('tag', 'is not', null)
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

	public get properties(): Promise<TEntityAsync<TProperty>[]> {
		if (this._properties) {
			return this._properties;
		}
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('user_properties')
				.where('user_id', '==', this.id)
				.where('property_id', 'is not', null)
				.innerJoin('properties', 'properties.id', 'user_properties.property_id')
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

	public get sessions(): Promise<TEntityAsync<ISession>[]> {
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

	public get createSessionRequests(): Promise<TEntityAsync<ICreateSessionRequest>[]> {
		if (this._sessionRequests) {
			return this._sessionRequests;
		}
		const promise = (async () => {
			const requestsPartial = await this.db
				.selectFrom('createsessionrequests')
				.where('user', '==', this.id)
				.selectAll()
				.execute();
			const requests = requestsPartial.map((requestPartial) => {
				const request = new CreateSessionRequest(requestPartial, this.db);
				return request;
			});
			return requests;
		})();
		return promise;
	}

	public get owns(): Promise<TEntityAsync<IGroup>[]> {
		if (this._owns) {
			return this._owns;
		}
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('user_owns_groups')
				.where('user_id', '==', this.id)
				.where('group_id', 'is not', null)
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

	public get belongs(): Promise<TEntityAsync<IGroup>[]> {
		if (this._belongs) {
			return this._belongs;
		}
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('users_belongs_groups')
				.where('user_id', '==', this.id)
				.where('group_id', 'is not', null)
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

	public get watchesGroups(): Promise<TEntityAsync<IGroup>[]> {
		if (this._watchesGroups) {
			return this._watchesGroups;
		}
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('users_watches_groups')
				.where('user_id', '==', this.id)
				.where('group_id', 'is not', null)
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

	public get watchesPages(): Promise<TEntityAsync<IPage>[]> {
		if (this._watchesPages) {
			return this._watchesPages;
		}
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('users_watches_pages')
				.where('user_id', '==', this.id)
				.where('page_id', 'is not', null)
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

	public get pages(): Promise<TEntityAsync<IPage>[]> {
		if (this._pages) {
			return this._pages;
		}
		const promise = (async () => {
			const pagesPartial = await this.db
				.selectFrom('user_pages')
				.where('user_id', '==', this.id)
				.where('page_id', 'is not', null)
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

	public get apiTokens(): Promise<TEntityAsync<IAPIToken>[]> {
		if (this._apiTokens) {
			return this._apiTokens;
		}
		const promise = (async () => {
			const tokensPartial = await this.db
				.selectFrom('apitokens')
				.where('user', '==', this.id)
				.selectAll()
				.execute();
			const tokens = tokensPartial.map((tokenPartial) => {
				const token = new APIToken(tokenPartial, this.db);
				return token;
			});
			return tokens;
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
