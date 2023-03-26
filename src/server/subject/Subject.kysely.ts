import { Kysely } from 'kysely';
import { Database } from '../Database';
import { EntityAsync } from '../EntityAsync';
import { createProperty } from '../kysely/createProperty.kysely';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ITeacher } from '../teacher/ITeacher';
import { ISubject } from './ISubject';

export class Subject implements EntityAsync<ISubject> {

	public constructor(subject: Database['subjects'], db: Kysely<Database>) {
		this.db = db;
		this.id = subject.id;
		this.code = subject.code;
		this.name = subject.name;
		this.nameRuby = subject.nameRuby;
		this.classes = subject.classes;
		this.updatedAt = subject.updatedAt;
		this.grades = subject.grades;
		this.units = subject.units;
	}

	private readonly db: Kysely<Database>;
	public readonly id: string;
	public code?: string;
	public name: string;
	public nameRuby?: string;
	public classes: string[];
	public updatedAt: number;
	public grades: number[];
	public units?: number;
	private _teachers?: Promise<EntityAsync<ITeacher>[]>;
	private _categories?: Promise<EntityAsync<ISubjectCategory>[]>;
	private _semesters?: Promise<EntityAsync<ISubjectSemester>[]>;
	private _weeks?: Promise<EntityAsync<ISubjectWeek>[]>;
	private _places?: Promise<EntityAsync<IPlace>[]>;
	private _properties?: Promise<EntityAsync<TProperty>[]>;

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

	public get categories(): Promise<EntityAsync<ISubjectCategory>[]> {
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

	public get semesters(): Promise<EntityAsync<ISubjectSemester>[]> {
		if (this._semesters) {
			return this._semesters;
		}
		const promise = (async () => {
			const semesters = await this.db
				.selectFrom('subjects_semesters')
				.where('subject_id', '==', this.id)
				.innerJoin('subjectsemesters', 'subjectsemesters.id', 'subjects_semesters.semester_id')
				.selectAll()
				.execute();
			return semesters;
		})();
		return promise;
	}

	public get weeks(): Promise<EntityAsync<ISubjectWeek>[]> {
		if (this._weeks) {
			return this._weeks;
		}
		const promise = (async () => {
			const weeks = await this.db
				.selectFrom('subjects_weeks')
				.where('subject_id', '==', this.id)
				.innerJoin('subjectweeks', 'subjectweeks.id', 'subjects_weeks.week_id')
				.selectAll()
				.execute();
			return weeks;
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

	public get properties(): Promise<EntityAsync<TProperty>[]> {
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
				const property = createProperty(propertyPartial, this.db);
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

	public set semesters(semesters) {
		this._semesters = semesters;
	}

	public set weeks(weeks) {
		this._weeks = weeks;
	}

	public set places(places) {
		this._places = places;
	}

	public set properties(properties) {
		this._properties = properties;
	}

}
