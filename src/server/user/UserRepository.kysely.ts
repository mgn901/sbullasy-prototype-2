import { IAPIToken } from '../api-token/IAPIToken';
import { TEntityAsync } from '../TEntityAsync';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { db } from '../database/db.kysely';
import { IPage } from '../page/IPage';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { IUserTagRegistration } from './IUserTagRegistration';
import { User } from './User.kysely';
import { ICreateSessionRequest } from '../create-session-request/ICreateSessionRequest';

export class UserRepository implements IUserRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<TEntityAsync<IUser>[]> {
		const usersPartial = await db
			.selectFrom('users')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const users = usersPartial.map((userPartial) => {
			const user = new User(userPartial, db);
			return user;
		});
		return users;
	}

	public async findByID(id: string): Promise<TEntityAsync<IUser> | undefined> {
		const users = await this.findByIDs(id);
		const user = users[0];
		return user;
	}

	public async findByEmail(email: string): Promise<TEntityAsync<IUser> | undefined> {
		const usersPartial = await db
			.selectFrom('users')
			.where('email', '==', email)
			.selectAll()
			.execute();
		const userPartial = usersPartial[0];
		if (!userPartial) {
			return undefined;
		}
		const user = new User(userPartial, db);
		return user;
	}

	public async findBySessionID(sessionID: string): Promise<TEntityAsync<IUser> | undefined> {
		const usersPartial = await db
			.selectFrom('sessions')
			.where('id', '==', sessionID)
			.where('user', 'is not', null)
			.innerJoin('users', 'users.id', 'sessions.user')
			.selectAll()
			.execute();
		const userPartial = usersPartial[0];
		if (!userPartial) {
			return undefined;
		}
		const user = new User(userPartial, db);
		return user;
	}

	public async findByAPIToken(token: string): Promise<TEntityAsync<IUser> | undefined> {
		const usersPartial = await db
			.selectFrom('apitokens')
			.where('token', '==', token)
			.where('user', 'is not', null)
			.innerJoin('users', 'users.id', 'apitokens.user')
			.selectAll()
			.execute();
		const userPartial = usersPartial[0];
		if (!userPartial) {
			return undefined;
		}
		const user = new User(userPartial, db);
		return user;
	}

	public async save(user: IUser | TEntityAsync<IUser>): Promise<void> {
		const { id, email, displayName, createdAt, ipAddress, isOnboarded } = user;
		const userPartial = { id, email, displayName, createdAt, ipAddress, isOnboarded };
		const oldProperties = await db
			.selectFrom('user_properties')
			.where('user_id', '==', id)
			.where('property_id', 'is not', null)
			.select('property_id')
			.execute();
		const properties = await user.properties;
		const registrations = await user.tagRegistrations;
		const sessions = await user.sessions;
		const sessionRequests = await user.createSessionRequests;
		const owns = await user.owns;
		const belongs = await user.belongs;
		const watchesGroups = await user.watchesGroups;
		const watchesPages = await user.watchesPages;
		const pages = await user.pages;
		const apiTokens = await user.apiTokens;
		const oldPropertyIDs = oldProperties.map(oldProperty => oldProperty.property_id);
		const propertyIDs = properties.map(property => property.id);
		const registrationIDs = registrations.map(tag => tag.id);
		const sessionIDs = sessions.map(session => session.id);
		const sessionRequestIDs = sessionRequests.map(request => request.id);
		const ownsIDs = owns.map(group => group.id);
		const belongsIDs = belongs.map(group => group.id);
		const watchesGroupIDs = watchesGroups.map(group => group.id);
		const watchesPageIDs = watchesPages.map(page => page.id);
		const pageIDs = pages.map(page => page.id);
		const tokenIDs = apiTokens.map(token => token.id);

		await db
			.insertInto('users')
			.values(userPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(userPartial))
			.executeTakeFirst();

		await db
			.deleteFrom('user_properties')
			.where('user_id', '==', id)
			.where('property_id', 'not in', propertyIDs)
			.executeTakeFirst();
		await db
			.deleteFrom('properties')
			.where('id', 'in', oldPropertyIDs)
			.where('id', 'not in', propertyIDs)
			.executeTakeFirst();
		properties.forEach(async (property) => {
			const value = await property.value;
			const propertyPartial = {
				id: property.id,
				key: property.key,
				type: property.type,
				value: typeof value === 'string' ? value : value?.id,
			};
			const userPropertiesItem = {
				user_id: id,
				property_id: property.id,
			};
			await db
				.insertInto('properties')
				.values(propertyPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(propertyPartial))
				.executeTakeFirst();
			await db
				.insertInto('user_properties')
				.values(userPropertiesItem)
				.onConflict(oc => oc
					.columns(['user_id', 'property_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('usertagregistrations')
			.where('user', '==', id)
			.where('id', 'not in', registrationIDs)
			.executeTakeFirst();
		registrations.forEach(async (registration) => {
			const user = await registration.user;
			const tag = await registration.tag;
			const registrationPartial: TEntityWithoutEntityKey<IUserTagRegistration> = {
				id: registration.id,
				tag: tag.id,
				user: user.id,
				expiresAt: registration.expiresAt,
			};
			await db
				.insertInto('usertagregistrations')
				.values(registrationPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(registrationPartial))
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('sessions')
			.where('user', '==', id)
			.where('id', 'not in', sessionIDs)
			.executeTakeFirst();
		sessions.forEach(async (session) => {
			const user = await session.user;
			const sessionPartial = {
				id: session.id,
				user: user.id,
				name: session.name,
				loggedInAt: session.loggedInAt,
				expiresAt: session.expiresAt,
				ipAddress: session.ipAddress,
			};
			await db
				.insertInto('sessions')
				.values(sessionPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(sessionPartial))
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('createsessionrequests')
			.where('user', '==', id)
			.where('id', 'not in', sessionRequestIDs)
			.executeTakeFirst();
		sessionRequests.forEach(async (request) => {
			const user = await request.user;
			const requestPartial: TEntityWithoutEntityKey<ICreateSessionRequest> = {
				id: request.id,
				createdAt: request.createdAt,
				token: request.token,
				isDisposed: request.isDisposed,
				user: user.id,
			};
			await db
				.insertInto('createsessionrequests')
				.values(requestPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(requestPartial))
				.executeTakeFirst();
		});

		await db
			.deleteFrom('user_owns_groups')
			.where('user_id', '==', id)
			.where('group_id', 'not in', ownsIDs)
			.executeTakeFirst();
		ownsIDs.forEach(async (groupID) => {
			const userOwnsGroupsItem = {
				user_id: id,
				group_id: groupID,
			};
			await db
				.insertInto('user_owns_groups')
				.values(userOwnsGroupsItem)
				.onConflict(oc => oc
					.columns(['user_id', 'group_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('users_belongs_groups')
			.where('user_id', '==', id)
			.where('group_id', 'not in', belongsIDs)
			.executeTakeFirst();
		belongsIDs.forEach(async (groupID) => {
			const usersBelongsGroupsItem = {
				user_id: id,
				group_id: groupID,
			};
			await db
				.insertInto('users_belongs_groups')
				.values(usersBelongsGroupsItem)
				.onConflict(oc => oc
					.columns(['user_id', 'group_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('users_watches_groups')
			.where('user_id', '==', id)
			.where('group_id', 'not in', watchesGroupIDs)
			.executeTakeFirst();
		watchesGroupIDs.forEach(async (groupID) => {
			const usersWatchesGroupsItem = {
				user_id: id,
				group_id: groupID,
			};
			await db
				.insertInto('users_watches_groups')
				.values(usersWatchesGroupsItem)
				.onConflict(oc => oc
					.columns(['user_id', 'group_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('users_watches_pages')
			.where('user_id', '==', id)
			.where('page_id', 'not in', watchesPageIDs)
			.executeTakeFirst();
		watchesPageIDs.forEach(async (pageID) => {
			const usersWatchesPagesItem = {
				user_id: id,
				page_id: pageID,
			};
			await db
				.insertInto('users_watches_pages')
				.values(usersWatchesPagesItem)
				.onConflict(oc => oc
					.columns(['user_id', 'page_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('user_pages')
			.where('user_id', '==', id)
			.where('page_id', 'not in', pageIDs)
			.executeTakeFirst();
		pages.forEach(async (page) => {
			const pagePartial: TEntityWithoutEntityKey<IPage> = {
				id: page.id,
				name: page.name,
				type: page.type,
				body: page.body,
				createdAt: page.createdAt,
				updatedAt: page.updatedAt,
				startsAt: page.startsAt,
				endsAt: page.endsAt,
			};
			const userPagesItem = {
				user_id: id,
				page_id: page.id,
			};
			await db
				.insertInto('pages')
				.values(pagePartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(pagePartial))
				.executeTakeFirst();
			await db
				.insertInto('user_pages')
				.values(userPagesItem)
				.onConflict(oc => oc
					.columns(['user_id', 'page_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('apitokens')
			.where('user', '==', id)
			.where('id', 'not in', tokenIDs)
			.executeTakeFirst();
		apiTokens.forEach(async (token) => {
			const user = await token.user;
			const tokenPartial: TEntityWithoutEntityKey<IAPIToken> = {
				id: token.id,
				createdAt: token.createdAt,
				token: token.token,
				permission: token.permission,
				user: user.id,
			};
			await db
				.insertInto('apitokens')
				.values(tokenPartial)
				.executeTakeFirst();
			return;
		});

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('users')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
