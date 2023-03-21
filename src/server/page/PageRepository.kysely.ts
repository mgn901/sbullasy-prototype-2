import { EntityAsync } from '../EntityAsync';
import { db } from '../kysely/db';
import { IPage } from './IPage';
import { IPageRepository } from './IPageRepository';
import { Page } from './Page.kysely';

export class PageRepository implements IPageRepository {

	public async findByIDs(...ids: string[]): Promise<EntityAsync<IPage>[]> {
		const pagesPartial = await db
			.selectFrom('pages')
			.where('id', 'in', ids)
			.selectAll()
			.execute();
		const pages = pagesPartial.map((pagePartial) => {
			const page = new Page(pagePartial, db);
			return page;
		});
		return pages;
	}

	public async save(page: IPage | EntityAsync<IPage>): Promise<void> {
		const { id, name, type, body, createdAt, updatedAt, startsAt, endsAt } = page;
		const pagePartial = { id, name, type, body, createdAt, updatedAt, startsAt, endsAt };
		const createdByUser = await page.createdByUser;
		const createdByGroup = await page.createdByGroup;
		const places = await page.places;
		const tags = await page.tags;
		const properties = await page.properties;
		const createdByUserID = createdByUser?.id;
		const createdByGroupID = createdByGroup?.id;
		const placeIDs = places.map(place => place.id);
		const tagIDs = tags.map(tag => tag.id);
		const propertyIDs = properties.map(property => property.id);

		if (createdByUserID) {
			const userPagesItem = {
				user_id: createdByUserID,
				page_id: id,
			};
			await db
				.insertInto('user_pages')
				.values(userPagesItem)
				.onConflict(oc => oc
					.columns(['user_id', 'page_id'])
					.doNothing())
				.executeTakeFirst();
		}

		if (createdByGroupID) {
			const groupPagesItem = {
				group_id: createdByGroupID,
				page_id: id,
			};
			await db
				.insertInto('group_pages')
				.values(groupPagesItem)
				.onConflict(oc => oc
					.columns(['group_id', 'page_id'])
					.doNothing())
				.executeTakeFirst();
		}

		await db
			.deleteFrom('pages_places')
			.where('page_id', '==', id)
			.where('place_id', 'not in', placeIDs)
			.executeTakeFirst();
		places.forEach(async (place) => {
			const pagesPlacesItem = {
				page_id: id,
				place_id: place.id,
			};
			await db
				.insertInto('pages_places')
				.values(pagesPlacesItem)
				.onConflict(oc => oc
					.columns(['page_id', 'place_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('pages_tags')
			.where('page_id', '==', id)
			.where('tag_id', 'not in', tagIDs)
			.executeTakeFirst();
		tags.forEach(async (tag) => {
			const pagesTagsItem = {
				page_id: id,
				tag_id: tag.id,
			};
			await db
				.insertInto('pages_tags')
				.values(pagesTagsItem)
				.onConflict(oc => oc
					.columns(['page_id', 'tag_id'])
					.doNothing())
				.executeTakeFirst();
			return;
		});

		await db
			.deleteFrom('page_properties')
			.where('page_id', '==', id)
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
			const pagePropertiesItem = {
				page_id: id,
				property_id: property.id,
			};
			await db
				.insertInto('page_properties')
				.values(pagePropertiesItem)
				.onConflict(oc => oc
					.columns(['page_id', 'property_id'])
					.doNothing())
				.executeTakeFirst();
			await db
				.insertInto('properties')
				.values(propertyPartial)
				.onConflict(oc => oc
					.column('id')
					.doUpdateSet(propertyPartial))
				.executeTakeFirst();
			return;
		});

		await db
			.insertInto('pages')
			.values(pagePartial)
			.onConflict(oc => oc
				.column('id')
				.doUpdateSet(pagePartial))
			.executeTakeFirst();

		return;
	}

	public async deleteByID(id: string): Promise<void> {
		await db
			.deleteFrom('user_pages')
			.where('page_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('group_pages')
			.where('page_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('pages_places')
			.where('page_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('pages_tags')
			.where('page_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('users_watches_pages')
			.where('page_id', '==', id)
			.executeTakeFirst();

		await db
			.deleteFrom('pages')
			.where('id', '==', id)
			.executeTakeFirst();

		return;
	}

}
