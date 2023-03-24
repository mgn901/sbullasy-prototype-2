import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { Group } from './Group.kysely';
import { IGroup } from './IGroup';
import { IGroupRepository } from './IGroupRepository';

export class GroupRepository implements IGroupRepository {

	public constructor() { }

	public async findByIDs(...ids: IGroup['id'][]): Promise<EntityAsync<IGroup>[]> {
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

	public async findByID(id: string): Promise<EntityAsync<IGroup>> {
		const groups = await this.findByIDs(id);
		const group = groups[0];
		return group;
	}

	public async save(group: EntityAsync<IGroup> | IGroup): Promise<void> {
		const { id, name, createdAt, updatedAt, invitationToken } = group;
		const groupPartial = { id, name, createdAt, updatedAt, invitationToken };
		const owner = await group.owner;
		const tags = await group.tags;
		const properties = await group.properties;
		const members = await group.members;
		const tagIDs = tags.map(tag => tag.id);
		const propertyIDs = properties.map(property => property.id);
		const memberIDs = members.map(member => member.id);
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
			.onConflict(oc => {
				return oc
					.column('group_id')
					.doUpdateSet(userOwnsGroupsItem);
			})
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

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		const group = (await this.findByIDs(id))[0];
		const properties = await group.properties;
		const propertyIDs = properties.map(property => property.id);

		await db
			.deleteFrom('groups_tags')
			.where('group_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('group_properties')
			.where('group_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('properties')
			.where('id', 'in', propertyIDs)
			.executeTakeFirst();

		await db
			.deleteFrom('properties')
			.where('group', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('user_owns_groups')
			.where('group_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('users_belongs_groups')
			.where('group_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('groups')
			.where('id', '==', id)
			.execute();

		return;
	}

}