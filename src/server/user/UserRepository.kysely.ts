import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IUser } from './IUser';
import { IUserRepository } from './IUserRepository';
import { User } from './User.kysely';

export class UserRepository implements IUserRepository {

	public constructor() { }

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IUser>[]> {
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

	public async save(user: IUser | EntityAsync<IUser>): Promise<void> {
		const { id, email, password, displayName } = user;
		const userPartial = { id, email, password, displayName };
		const properties = await user.properties;
		const tags = await user.tags;
		const sessions = await user.sessions;
		const owns = await user.owns;
		const belongs = await user.belongs;
		const watchesGroups = await user.watchesGroups;
		const watchesPages = await user.watchesPages;
		const pages = await user.pages;
		const propertyIDs = properties.map(property => property.id);
		const tagIDs = tags.map(tag => tag.id);
		const sessionIDs = sessions.map(session => session.id);
		const ownsIDs = owns.map(group => group.id);
		const belongsIDs = belongs.map(group => group.id);
		const watchesGroupIDs = watchesGroups.map(group => group.id);
		const watchesPageIDs = watchesPages.map(page => page.id);
		const pageIDs = pages.map(page => page.id);

		await db
			.deleteFrom('user_properties')
			.where('user_id', '==', id)
			.where('property_id', 'not in', propertyIDs)
			.executeTakeFirst();
		await db
			.deleteFrom('properties')
			.where('id', 'not in', propertyIDs)
			.executeTakeFirst();
		properties.forEach(async (property) => {
			const user = await property.user;
			const group = await property.group;
			const page = await property.page;
			const propertyPartial = {
				id: property.id,
				key: property.key,
				value: property.value,
				user: user?.id,
				group: group?.id,
				page: page?.id,
			};
			const userPropertiesItem = {
				user_id: id,
				property_id: property.id,
			};
			await db
				.insertInto('properties')
				.values(propertyPartial)
				.onConflict(oc => {
					return oc
						.column('id')
						.doUpdateSet(propertyPartial)
				})
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
			.deleteFrom('users_tags')
			.where('user_id', '==', id)
			.where('tag_id', 'not in', tagIDs)
			.executeTakeFirst();
		tagIDs.forEach(async (tagID) => {
			const usersTagsItem = {
				user_id: id,
				tag_id: tagID,
			}
			await db
				.insertInto('users_tags')
				.values(usersTagsItem)
				.onConflict(oc => oc
					.columns(['user_id', 'tag_id'])
					.doNothing())
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
				.onConflict(oc => {
					return oc
						.column('id')
						.doUpdateSet(sessionPartial)
				})
				.executeTakeFirst();
			return;
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
		pageIDs.forEach(async (pageID) => {
			const userPagesItem = {
				user_id: id,
				page_id: pageID,
			};
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
			.insertInto('users')
			.values(userPartial)
			.onConflict(oc => {
				return oc
					.column('id')
					.doUpdateSet(userPartial)
			})
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		const users = await this.findByIDs(id);
		const user = users[0];
		const properties = await user.properties;
		const propertyIDs = properties.map(property => property.id);

		await db
			.deleteFrom('users_tags')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('user_properties')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('properties')
			.where('id', 'in', propertyIDs)
			.executeTakeFirst();

		await db
			.deleteFrom('sessions')
			.where('user', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('user_owns_groups')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('users_belongs_groups')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('users_watches_groups')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('users_watches_pages')
			.where('user_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('properties')
			.where('user', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('user_pages')
			.where('user_id', '==', id)
			.executeTakeFirst();

		return;
	}

}
