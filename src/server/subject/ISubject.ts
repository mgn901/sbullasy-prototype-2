import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ITeacher } from '../teacher/ITeacher';

export interface ISubject {
	readonly id: string;
	code?: string;
	name: string;
	nameRuby?: string;
	teachers: ITeacher[];
	categories: ISubjectCategory[];
	classes: string[];
	updatedAt: number;
	grades: number[];
	semesters: ISubjectSemester[];
	weeks: ISubjectWeek[];
	places: IPlace[];
	units?: number;
	properties: IProperty[];
}
