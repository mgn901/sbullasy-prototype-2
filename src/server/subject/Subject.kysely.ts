import { Kysely } from 'kysely';
import { TDatabase } from '../database/TDatabase';
import { TEntityAsync } from '../TEntityAsync';
import { createProperty } from '../property/createProperty.kysely';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ITeacher } from '../teacher/ITeacher';
import { ISubject } from './ISubject';

export class Subject implements TEntityAsync<ISubject> {

	public constructor(subject: TDatabase['subjects'], db: Kysely<TDatabase>) {
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

	private readonly db: Kysely<TDatabase>;
	public readonly id: string;
	public code?: string;
	public name: string;
	public nameRuby?: string;
	public classes: string[];
	public updatedAt: number;
	public grades: number[];
	public units?: number;
	private _teachers?: Promise<TEntityAsync<ITeacher>[]>;
	private _categories?: Promise<TEntityAsync<ISubjectCategory>[]>;
	private _semesters?: Promise<TEntityAsync<ISubjectSemester>[]>;
	private _weeks?: Promise<TEntityAsync<ISubjectWeek>[]>;
	private _places?: Promise<TEntityAsync<IPlace>[]>;
	private _properties?: Promise<TEntityAsync<TProperty>[]>;

	public get teachers(): Promise<TEntityAsync<ITeacher>[]> {
		if (this._teachers) {
			return this._teachers;
		}
		const promise = (async () => {
			const teachers = await this.db
				.selectFrom('subjects_teachers')
				.where('subject_id', '==', this.id)
				.where('teacher_id', 'is not', null)
				.innerJoin('teachers', 'teachers.id', 'subjects_teachers.teacher_id')
				.selectAll()
				.execute();
			return teachers;
		})();
		return promise;
	}

	public get categories(): Promise<TEntityAsync<ISubjectCategory>[]> {
		if (this._categories) {
			return this._categories;
		}
		const promise = (async () => {
			const categories = await this.db
				.selectFrom('subjects_categories')
				.where('subject_id', '==', this.id)
				.where('category_id', 'is not', null)
				.innerJoin('categories', 'categories.id', 'subjects_categories.category_id')
				.selectAll()
				.execute();
			return categories;
		})();
		return promise;
	}

	public get semesters(): Promise<TEntityAsync<ISubjectSemester>[]> {
		if (this._semesters) {
			return this._semesters;
		}
		const promise = (async () => {
			const semesters = await this.db
				.selectFrom('subjects_semesters')
				.where('subject_id', '==', this.id)
				.where('semester_id', 'is not', null)
				.innerJoin('subjectsemesters', 'subjectsemesters.id', 'subjects_semesters.semester_id')
				.selectAll()
				.execute();
			return semesters;
		})();
		return promise;
	}

	public get weeks(): Promise<TEntityAsync<ISubjectWeek>[]> {
		if (this._weeks) {
			return this._weeks;
		}
		const promise = (async () => {
			const weeks = await this.db
				.selectFrom('subjects_weeks')
				.where('subject_id', '==', this.id)
				.where('week_id', 'is not', null)
				.innerJoin('subjectweeks', 'subjectweeks.id', 'subjects_weeks.week_id')
				.selectAll()
				.execute();
			return weeks;
		})();
		return promise;
	}

	public get places(): Promise<TEntityAsync<IPlace>[]> {
		if (this._places) {
			return this._places;
		}
		const promise = (async () => {
			const places = await this.db
				.selectFrom('subjects_places')
				.where('subject_id', '==', this.id)
				.where('place_id', 'is not', null)
				.innerJoin('places', 'places.id', 'subjects_places.place_id')
				.selectAll()
				.execute();
			return places;
		})();
		return promise;
	}

	public get properties(): Promise<TEntityAsync<TProperty>[]> {
		if (this._properties) {
			return this._properties;
		}
		const promise = (async () => {
			const propertiesPartial = await this.db
				.selectFrom('subjects_properties')
				.where('subject_id', '==', this.id)
				.where('property_id', 'is not', null)
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
