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

	constructor(subject: Database['subjects'], db: Kysely<Database>) {
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

	private db: Kysely<Database>;
	public id: string;
	public code: string;
	public name: string;
	public nameRuby: string;
	public class: string[];
	public updatedAt: number;
	public grade: number[];
	public semester: string[];
	public week: string[];
	public units: number;

	public get teachers(): EntityAsync<ITeacher>[] | Promise<EntityAsync<ITeacher>[]> {
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

	public get categories(): EntityAsync<ICategory>[] | Promise<EntityAsync<ICategory>[]> {
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

	public get places(): EntityAsync<IPlace>[] | Promise<EntityAsync<IPlace>[]> {
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

	public get properties(): EntityAsync<IProperty<string, string>>[] | Promise<EntityAsync<IProperty<string, string>>[]> {
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

}
