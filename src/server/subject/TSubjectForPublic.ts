import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ITeacher } from '../teacher/ITeacher';
import { ISubject } from './ISubject';

export type TSubjectForPublic = EntityWithoutEntityKey<ISubject> & {
	teachers: ITeacher[];
	categories: ISubjectCategory[];
	semesters: ISubjectSemester[];
	weeks: ISubjectWeek[];
	places: IPlace[];
	properties: EntityWithoutEntityKey<TProperty>[];
}