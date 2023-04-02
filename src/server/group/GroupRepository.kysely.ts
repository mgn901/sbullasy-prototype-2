import { TEntityAsync } from '../TEntityAsync';
import { db } from '../database/db.kysely';
import { Group } from './Group.kysely';
import { IGroup } from './IGroup';
import { IGroupRepository } from './IGroupRepository';

export class GroupRepository implements IGroupRepository {

	public constructor() { }

	public async findByIDs(...ids: IGroup['id'][]): Promise<TEntityAsync<IGroup>[]> {
		const groupsPartial = await db
			.selectFrom('groups')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const groups = groupsPartial.map((groupPartial) => {
			const group = new Group(groupPartial, db);
			return group;
		});
		return groups;
	}

	public async findByID(id: string): Promise<TEntityAsync<IGroup> | undefined> {
		const groups = await this.findByIDs(id);
		const group = groups[0];
		return group;
	}

	public async save(group: TEntityAsync<IGroup> | IGroup): Promise<void> {
		const { id, name, createdAt, updatedAt, invitationToken } = group;
		const groupPartial = { id, name, createdAt, updatedAt, invitationToken };
		const owner = await group.owner;
		const tags = await group.tags;
		const oldProperties = await db
			.selectFrom('group_properties')
			.where('group_id', '==', id)
			.where('property_id', 'is not', null)
			.select('property_id')
			.execute();
		const properties = await group.properties;
		const members = await group.members;
		const oldPages = await db
			.selectFrom('group_pages')
			.where('group_id', '==', id)
			.where('page_id', 'is not', null)
			.select('group_id')
			.execute();
		const pages = await group.pages;
		const tagIDs = tags.map(tag => tag.id);
		const oldPropertyIDs = oldProperties.map(oldProperty => oldProperty.property_id);
		const propertyIDs = properties.map(property => property.id);
		const memberIDs = members.map(member => member.id);
		const oldPageIDs = oldPages.map(oldPage => oldPage.group_id);
		const pageIDs = pages.map(page => page.id);
		const userOwnsGroupsItem = {
			user_id: owner.id,
			group_id: id,
		};

		await db
			.insertInto('groups')
			.values(groupPartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(groupPartial))
			.executeTakeFirst();

		await db
			.deleteFrom('groups_tags')
			.where('group_id', '==', id)
			.where('tag_id', 'not in', tagIDs)
			.executeTakeFirst();
		tagIDs.forEach(async (tagID) => {
			const groupsTagsItem = {
				group_id: id,
				tag_id: tagID,
			};
			await db
				.insertInto('groups_tags')
				.values(groupsTagsItem)
				.onConflict(oc => oc
					.columns(['group_id', 'tag_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('group_properties')
			.where('group_id', '==', id)
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
			const groupPropertiesItem = {
				group_id: id,
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
				.insertInto('group_properties')
				.values(groupPropertiesItem)
				.onConflict(oc => oc
					.columns(['group_id', 'property_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.insertInto('user_owns_groups')
			.values(userOwnsGroupsItem)
			.onConflict(oc => oc
				.column('group_id')
				.doUpdateSet(userOwnsGroupsItem))
			.executeTakeFirst();

		await db
			.deleteFrom('users_belongs_groups')
			.where('group_id', '==', id)
			.where('user_id', 'not in', memberIDs)
			.executeTakeFirst();
		memberIDs.forEach(async (memberID) => {
			const userBelongsGroupsItem = {
				user_id: memberID,
				group_id: id,
			};
			await db
				.insertInto('users_belongs_groups')
				.values(userBelongsGroupsItem)
				.onConflict(oc => oc
					.columns(['user_id', 'group_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('group_pages')
			.where('group_id', '==', id)
			.where('page_id', 'not in', pageIDs)
			.executeTakeFirst();
		await db
			.deleteFrom('pages')
			.where('id', 'in', oldPageIDs)
			.where('id', 'not in', pageIDs)
			.executeTakeFirst();
		pages.forEach(async (page) => {
			const pagePartial = {
				id: page.id,
				name: page.name,
				type: page.type,
				body: page.body,
				createdAt: page.createdAt,
				updatedAt: page.updatedAt,
				startsAt: page.startsAt,
				endsAt: page.endsAt,
			};
			const groupsPagesItem = {
				group_id: id,
				page_id: page.id,
			}
			await db
				.insertInto('pages')
				.values(pagePartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(pagePartial))
				.executeTakeFirst();
			await db
				.insertInto('group_pages')
				.values(groupsPagesItem)
				.onConflict(oc => oc
					.columns(['page_id', 'group_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('groups')
			.where('id', '==', id)
			.execute();

		return;
	}

}
