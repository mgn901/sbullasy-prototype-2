import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ITeacher } from '../teacher/ITeacher';

export interface ISubject {
	readonly id: string;
	code: string;
	name: string;
	nameRuby: string;
	teachers: ITeacher[];
	categories: ISubjectCategory[];
	class: string[];
	updatedAt: number;
	grade: number[];
	semester: string[];
	week: string[];
	places: IPlace[];
	units: number;
	properties: IProperty[];
}
