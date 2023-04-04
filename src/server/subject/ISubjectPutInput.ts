import { IAPIToken } from '../api-token/IAPIToken';
import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from '../place/IPlace';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { ISubjectCategory } from '../subject-category/ISubjectCategory';
import { ISubjectSemester } from '../subject-semester/ISubjectSemester';
import { ISubjectWeek } from '../subject-week/ISubjectWeek';
import { ITeacher } from '../teacher/ITeacher';
import { ISubject } from './ISubject';

export interface ISubjectPutInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	subject: {
		id: ISubject['id'];
		code: ISubject['code'];
		name: ISubject['name'];
		nameRuby: ISubject['nameRuby'];
		teachers: ITeacher['id'][];
		categories: ISubjectCategory['id'][];
		classes: ISubject['classes'];
		grades: ISubject['grades'];
		semesters: ISubjectSemester['id'][];
		weeks: ISubjectWeek['id'];
		places: IPlace['id'][];
		units: ISubject['units'];
		properties: TEntityWithoutEntityKey<TProperty>[];
	};
}
