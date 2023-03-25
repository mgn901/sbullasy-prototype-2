import { ICategory } from '../categories/ICategory';
import { IPlace } from '../place/IPlace';
import { IProperty } from '../property/IProperty';
import { ITeacher } from '../teachers/ITeacher';

export interface ISubject {
	readonly id: string;
	code: string;
	name: string;
	nameRuby: string;
	teachers: ITeacher[];
	categories: ICategory[];
	class: string[];
	updatedAt: number;
	grade: number[];
	semester: string[];
	week: string[];
	places: IPlace[];
	units: number;
	properties: IProperty[];
}
