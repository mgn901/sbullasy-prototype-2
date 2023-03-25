import { Kysely } from 'kysely';
import { ICategory } from '../categories/ICategory';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { Property } from '../property/Property.kysely';
import { ITeacher } from '../teachers/ITeacher';
import { ISubject } from './ISubject';

export class Subject implements EntityAsync<ISubject> {

	public constructor(subject: Database['subjects'], db: Kysely<Database>) {
		this.db = db;
		this.id = subject.id;
		this.code = subject.code;
		this.name = subject.name;
		this.nameRuby = subject.nameRuby;
		this.class = subject.class;
		this.updatedAt = subject.updatedAt;
		this.grade = subject.grade;
		this.semester = subject.semester;
		this.week = subject.week;
		this.units = subject.units;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public code: string;
	public name: string;
	public nameRuby: string;
	public class: string[];
	public updatedAt: number;
	public grade: number[];
	public semester: string[];
	public week: string[];
	public units: number;
	private _teachers?: Promise<EntityAsync<ITeacher>[]>;
	private _categories?: Promise<EntityAsync<ICategory>[]>;
	private _places?: Promise<EntityAsync<IPlace>[]>;
	private _properties?: Promise<EntityAsync<IProperty>[]>;

	public get teachers(): Promise<EntityAsync<ITeacher>[]> {
		if (this._teachers) {
			return this._teachers;
		}
		const promise = (async () => {
			const teachers = await this.db
				.selectFrom('subjects_teachers')
				.where('subject_id', '==', this.id)
				.innerJoin('teachers', 'teachers.id', 'subjects_teachers.teacher_id')
				.selectAll()
				.execute();
			return teachers;
		})();
		return promise;
	}

	public get categories(): Promise<EntityAsync<ICategory>[]> {
		if (this._categories) {
			return this._categories;
		}
		const promise = (async () => {
			const categories = await this.db
				.selectFrom('subjects_categories')
				.where('subject_id', '==', this.id)
				.innerJoin('categories', 'categories.id', 'subjects_categories.category_id')
				.selectAll()
				.execute();
			return categories;
		})();
		return promise;
	}

	public get places(): Promise<EntityAsync<IPlace>[]> {
		if (this._places) {
			return this._places;
		}
		const promise = (async () => {
			const places = await this.db
				.selectFrom('subjects_places')
				.where('subject_id', '==', this.id)
				.innerJoin('places', 'places.id', 'subjects_places.place_id')
				.selectAll()
				.execute();
			return places;
		})();
		return promise;
	}

	public get properties(): Promise<EntityAsync<IProperty<string, string>>[]> {
		if (this._properties) {
			return this._properties;
		}
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('subjects_properties')
				.where('subject_id', '==', this.id)
				.innerJoin('properties', 'properties.id', 'subjects_properties.property_id')
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

	public set teachers(teachers) {
		this._teachers = teachers;
	}

	public set categories(categories) {
		this._categories = categories;
	}

	public set places(places) {
		this._places = places;
	}

	public set properties(properties) {
		this._properties = properties;
	}

}
