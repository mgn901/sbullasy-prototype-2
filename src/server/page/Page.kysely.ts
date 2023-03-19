import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { IPageTag } from '../page-tag/IPageTag';
import { PageTag } from '../page-tag/PageTag.kysely';
import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { Property } from '../property/Property.kysely';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IPage } from './IPage';

export class Page implements EntityAsync<IPage> {

	public constructor(page: Database['pages'], db: Kysely<Database>) {
		this.db = db;
		this.id = page.id;
		this.name = page.name;
		this.type = page.type;
		this.body = page.body;
		this.createdAt = page.createdAt;
		this.updatedAt = page.updatedAt;
		this.startsAt = page.startsAt;
		this.endsAt = page.endsAt;
	}

	private db: Kysely<Database>;
	public id: string;
	public name: string;
	public type: 'page' | 'event' | 'image';
	public body: string;
	public createdAt: number;
	public updatedAt: number;
	public startsAt?: number | undefined;
	public endsAt?: number | undefined;

	public get createdByUser(): Promise<EntityAsync<IUser>> | undefined {
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('user_pages')
				.where('page_id', '==', this.id)
				.innerJoin('users', 'users.id', 'user_pages.user_id')
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

	public get createdByGroup(): Promise<EntityAsync<IGroup>> | undefined {
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('group_pages')
				.where('page_id', '==', this.id)
				.innerJoin('groups', 'groups.id', 'group_pages.group_id')
				.selectAll()
				.execute();
			const groupPartial = groupsPartial[0];
			const group = new Group(groupPartial, this.db);
			return group;
		})();
		return promise;
	}

	public get places(): Promise<EntityAsync<IPlace>[]> {
		const promise = (async () => {
			const places = await this.db
				.selectFrom('pages_places')
				.where('page_id', '==', this.id)
				.innerJoin('places', 'places.id', 'pages_places.place_id')
				.selectAll()
				.execute();
			return places;
		})();
		return promise;
	}

	public get tags(): Promise<EntityAsync<IPageTag>[]> {
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('pages_tags')
				.where('page_id', '==', this.id)
				.innerJoin('pagetags', 'pagetags.id', 'pages_tags.tag_id')
				.selectAll()
				.execute();
			const tags = tagsPartial.map((tagPartial) => {
				const tag = new PageTag(tagPartial, this.db);
				return tag;
			})
			return tags;
		})();
		return promise;
	}

	public get properties(): Promise<EntityAsync<IProperty<string, string>>[]> {
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('page_properties')
				.where('page_id', '==', this.id)
				.innerJoin('properties', 'properties.id', 'page_properties.property_id')
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
}
