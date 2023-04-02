import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { Group } from '../group/Group.kysely';
import { IGroup } from '../group/IGroup';
import { createProperty } from '../property/createProperty.kysely';
import { IPageTag } from '../page-tag/IPageTag';
import { PageTag } from '../page-tag/PageTag.kysely';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { IUser } from '../user/IUser';
import { User } from '../user/User.kysely';
import { IPage } from './IPage';

export class Page implements TEntityAsync<IPage> {

	public constructor(page: TDatabase['pages'], db: Kysely<TDatabase>) {
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

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public name: string;
	public readonly type: 'page' | 'event' | 'image';
	public body: string;
	public readonly createdAt: number;
	public updatedAt: number;
	public startsAt?: number | undefined;
	public endsAt?: number | undefined;
	private _places?: Promise<TEntityAsync<IPlace>[]>;
	private _tags?: Promise<TEntityAsync<IPageTag>[]>;
	private _properties?: Promise<TEntityAsync<TProperty>[]>;

	public get createdByUser(): Promise<TEntityAsync<IUser> | undefined> | undefined {
		const promise = (async () => {
			const usersPartial = await this.db
				.selectFrom('user_pages')
				.where('page_id', '==', this.id)
				.where('user_id', 'is not', null)
				.innerJoin('users', 'users.id', 'user_pages.user_id')
				.selectAll()
				.execute();
			const userPartial = usersPartial[0];
			if (!userPartial) {
				return undefined;
			}
			const user = new User(userPartial, this.db);
			return user;
		})();
		return promise;
	}

	public get createdByGroup(): Promise<TEntityAsync<IGroup> | undefined> | undefined {
		const promise = (async () => {
			const groupsPartial = await this.db
				.selectFrom('group_pages')
				.where('page_id', '==', this.id)
				.where('group_id', 'is not', null)
				.innerJoin('groups', 'groups.id', 'group_pages.group_id')
				.selectAll()
				.execute();
			const groupPartial = groupsPartial[0];
			if (!groupPartial) {
				return undefined;
			}
			const group = new Group(groupPartial, this.db);
			return group;
		})();
		return promise;
	}

	public get places(): Promise<TEntityAsync<IPlace>[]> {
		if (this._places) {
			return this._places;
		}
		const promise = (async () => {
			const places = await this.db
				.selectFrom('pages_places')
				.where('page_id', '==', this.id)
				.where('place_id', 'is not', null)
				.innerJoin('places', 'places.id', 'pages_places.place_id')
				.selectAll()
				.execute();
			return places;
		})();
		return promise;
	}

	public get tags(): Promise<TEntityAsync<IPageTag>[]> {
		if (this._tags) {
			return this._tags;
		}
		const promise = (async () => {
			const tagsPartial = await this.db
				.selectFrom('pages_tags')
				.where('page_id', '==', this.id)
				.where('tag_id', 'is not', null)
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

	public get properties(): Promise<TEntityAsync<TProperty>[]> {
		if (this._properties) {
			return this._properties;
		}
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('page_properties')
				.where('page_id', '==', this.id)
				.where('property_id', 'is not', null)
				.innerJoin('properties', 'properties.id', 'page_properties.property_id')
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

	public set places(places) {
		this._places = places;
	}

	public set tags(tags) {
		this._tags = tags;
	}

	public set properties(properties) {
		this._properties = properties;
	}

}
